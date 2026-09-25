import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';
import { UserService } from '@/user/user.service';
import { User } from '@/user/entities/user.entity';
import { SignInDto } from './dto/signin.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { HashingService } from './common/services/hashing.service';
import { TokenService } from './token.service';
import { TokenPair } from './types/payload.type';
import { maskEmail } from './common/utils/mask.util';
import {
  ForgotPasswordResetTokenEventPayload,
  SystemEvents,
} from './common/constants/system-events.constant';
import { RefreshToken } from '@/refresh-token/entities/refresh-token.entity';
import { UserRole } from '@labour-hiring/enums';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { SignUpDto } from './dto/signup.dto';
import { OtpService } from '@/otp/otp.service';
import { Payload } from '@labour-hiring/types';

@Injectable()
export class AuthService {
  private readonly AUTH_FAILED_MESSAGE =
    'Authentication failed. Invalid email or password.';

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
    private readonly otpService: OtpService,
  ) {}

  async signup(dto: SignUpDto): Promise<TokenPair> {
    const user = await this.userService.create(
      dto.email,
      dto.password,
      dto.role,
    );
    const tokens = await this.issueTokenPair(user);
    this.logger.log(
      { email: maskEmail(user.email), role: user.role },
      'self-serve signup succeeded tokens issued',
    );
    return tokens;
  }

  async signupAdmin(dto: SignUpDto, createdBy: string): Promise<User> {
    const user = await this.userService.create(
      dto.email,
      dto.password,
      UserRole.ADMIN,
    );
    this.logger.log(
      { email: maskEmail(user.email), createdBy },
      'admin account created',
    );
    return user;
  }

  async signin(dto: SignInDto): Promise<TokenPair> {
    const { email, password } = dto;
    const user = await this.userService.findByEmailWithPassword(email);

    const isValidPassword = user
      ? await this.hashingService.compare(password, user.password)
      : false;

    if (!user || !isValidPassword) {
      this.logger.warn(
        { email: maskEmail(email) },
        'signin failed: invalid credentials',
      );
      throw new UnauthorizedException(this.AUTH_FAILED_MESSAGE);
    }

    const tokens = await this.issueTokenPair(user);
    this.logger.log(
      { email: maskEmail(email) },
      'signin succeeded tokens issued',
    );
    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const payload = this.verifyRefreshToken(refreshToken);

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      this.logger.warn(
        { userId: payload.sub },
        'user not found during token refresh',
      );
      throw new UnauthorizedException(this.AUTH_FAILED_MESSAGE);
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      this.logger.warn(
        { userId: payload.sub },
        'token version mismatch: token revoked',
      );
      throw new UnauthorizedException(this.AUTH_FAILED_MESSAGE);
    }

    const tokenToRotate: RefreshToken | null =
      await this.refreshTokenService.findByJti(payload.jti);

    if (!tokenToRotate) {
      await this.refreshTokenService.deleteAllUserTokens(payload.sub);
      this.logger.warn(
        { userId: payload.sub },
        'refresh token replay detected: all sessions invalidated',
      );
      throw new UnauthorizedException(this.AUTH_FAILED_MESSAGE);
    }

    const rotatedTokenId = tokenToRotate.id;

    const newTokens = await this.dataSource.transaction(async (manager) => {
      await this.refreshTokenService.deleteByIdWithManager(
        manager,
        rotatedTokenId,
      );

      const tokenPair = this.tokenService.generateTokenPair(user);

      await this.refreshTokenService.createWithManager(manager, {
        userId: user.id,
        token: tokenPair.refreshToken,
        jti: tokenPair.payload.jti,
      });

      return tokenPair;
    });

    this.logger.log(
      { email: maskEmail(user.email) },
      'refresh token rotated successfully',
    );

    return newTokens;
  }

  async forgotPassword(email: string): Promise<string> {
    const RESPONSE = 'If the email exists, a verification code will be sent';

    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.warn(
        { email: maskEmail(email) },
        'password reset requested for unregistered email',
      );
      return RESPONSE;
    }

    const otp = await this.otpService.generateAndStore(
      email,
      'forgot-password',
    );

    this.eventEmitter.emit(
      SystemEvents.SEND_FORGOT_PASSWORD_RESET_TOKEN,
      new ForgotPasswordResetTokenEventPayload(email, otp),
    );
    this.logger.log(
      { email: maskEmail(email) },
      `${SystemEvents.SEND_FORGOT_PASSWORD_RESET_TOKEN} event emitted`,
    );

    return RESPONSE;
  }

  async resendOtp(email: string): Promise<string> {
    const RESPONSE =
      'If the email exists, a new verification code will be sent';

    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.warn(
        { email: maskEmail(email) },
        'otp resend requested for unregistered email',
      );
      return RESPONSE;
    }

    const otp = await this.otpService.generateAndStore(
      email,
      'forgot-password',
    );

    this.eventEmitter.emit(
      SystemEvents.RESEND_FORGOT_PASSWORD_OTP,
      new ForgotPasswordResetTokenEventPayload(email, otp),
    );
    this.logger.log(
      { email: maskEmail(email) },
      `${SystemEvents.RESEND_FORGOT_PASSWORD_OTP} event emitted`,
    );

    return RESPONSE;
  }

  async verifyOtp(email: string, otp: string): Promise<{ resetToken: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.warn(
        { email: maskEmail(email) },
        'otp verification attempted for unregistered email',
      );
      throw new BadRequestException('Invalid or expired verification code.');
    }

    await this.otpService.verifyAndDelete({
      email,
      otp,
      purpose: 'forgot-password',
    });

    const resetToken = this.tokenService.generateResetToken(user);
    this.logger.log(
      { email: maskEmail(email) },
      'otp verified, reset token issued',
    );

    return { resetToken };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<string> {
    const { sub, email } = this.verifyResetToken(dto.token);

    await this.userService.resetPassword(email, dto.password);
    await this.refreshTokenService.deleteAllUserTokens(sub);

    this.logger.log({ userId: sub }, 'password reset successfully');
    return 'Password reset successfully. Please sign in with your new password.';
  }

  async signout(userId: string): Promise<{ message: string }> {
    await this.refreshTokenService.deleteAllUserTokens(userId);
    this.logger.log({ userId }, 'user signed out: all sessions revoked');
    return { message: 'Signed out successfully' };
  }

  private verifyRefreshToken(token: string): Payload {
    try {
      return this.tokenService.verifyRefreshToken(token);
    } catch (error) {
      this.logger.warn(
        { err: (error as Error).message },
        'refresh token verification failed: invalid or expired token',
      );
      throw new UnauthorizedException(this.AUTH_FAILED_MESSAGE);
    }
  }

  private verifyResetToken(token: string) {
    try {
      return this.tokenService.verifyResetToken(token);
    } catch (error) {
      this.logger.warn(
        { err: (error as Error).message },
        'reset token verification failed: invalid or expired token',
      );
      throw new BadRequestException('Reset token is invalid or expired');
    }
  }

  private async issueTokenPair(user: User): Promise<TokenPair> {
    const tokenPair = this.tokenService.generateTokenPair(user);

    await this.refreshTokenService.create({
      userId: tokenPair.payload.sub,
      token: tokenPair.refreshToken,
      jti: tokenPair.payload.jti,
    });

    return tokenPair;
  }
}

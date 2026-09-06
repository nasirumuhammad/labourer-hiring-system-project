import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { jwtConfig } from '@/common/config/jwt.config';
import { User } from '@/user/entities/user.entity';
import { Payload, ResetPasswordPayload, TokenPair } from './types/payload.type';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  buildPayload(user: User): Payload {
    return {
      jti: randomUUID(),
      sub: user.id,
      tokenVersion: user.tokenVersion,
      role: user.role,
    };
  }

  generateAccessToken(payload: Payload): string {
    const token = this.jwtService.sign(payload);
    this.logger.debug({ sub: payload.sub }, 'access token generated');
    return token;
  }

  generateRefreshToken(payload: Payload): string {
    const token = this.jwtService.sign(payload, {
      secret: this.jwt.refresh.secret,
      expiresIn: this.jwt.refresh.expiresIn as any,
    });
    this.logger.debug(
      { sub: payload.sub, jti: payload.jti },
      'refresh token generated',
    );
    return token;
  }

  generateResetToken(user: User): string {
    const payload: ResetPasswordPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.jwt.refresh.secret,
      expiresIn: this.jwt.refresh.expiresIn as any,
    });
    this.logger.debug({ sub: user.id }, 'reset token generated');
    return token;
  }

  verifyRefreshToken(token: string): Payload {
    return this.jwtService.verify<Payload>(token, {
      secret: this.jwt.refresh.secret,
    });
  }

  verifyResetToken(token: string): ResetPasswordPayload {
    return this.jwtService.verify<ResetPasswordPayload>(token, {
      secret: this.jwt.reset.secret,
    });
  }

  generateTokenPair(user: User): TokenPair {
    const payload = this.buildPayload(user);
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken, payload };
  }
}

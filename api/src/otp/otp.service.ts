import { HashingService } from '@/auth/common/services/hashing.service';
import { maskEmail } from '@/auth/common/utils/mask.util';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';
import { randomInt } from 'node:crypto';
import { REDIS_CLIENT } from '@/common/redis/redis.module';

export type Purpose = 'verify-email' | 'forgot-password' | 'login';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly OTP_TTL_SECONDS = 5 * 60;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly hashingService: HashingService,
  ) {}

  private generate() {
    return randomInt(100000, 1000000).toString();
  }

  private generateKey(email: string, purpose: Purpose) {
    return `otp:${purpose}:${email}`;
  }

  async generateAndStore(email: string, purpose: Purpose) {
    const key = this.generateKey(email, purpose);
    const otp = this.generate();
    await this.redis.set(
      key,
      await this.hashingService.hash(otp),
      'EX',
      this.OTP_TTL_SECONDS,
    );
    return otp;
  }

  async verifyAndDelete(payload: {
    email: string;
    purpose: Purpose;
    otp: string;
  }) {
    const responseMesage = 'Invalid or expired verification code.';
    const { email, otp, purpose } = payload;
    const key = this.generateKey(email, purpose);
    const existingOtp = await this.redis.get(key);
    if (!existingOtp) {
      this.logger.warn(
        { email: maskEmail(email) },
        `otp not found for ${purpose}`,
      );
      throw new BadRequestException(responseMesage);
    }
    const validOtp = await this.hashingService.compare(otp, existingOtp);
    if (!validOtp) {
      this.logger.warn(
        { email: maskEmail(email) },
        `Invalid otp for ${purpose}`,
      );
      throw new BadRequestException(responseMesage);
    }
    await this.redis.del(key);
    this.logger.log(
      { email: maskEmail(email) },
      `otp verified and deleted successfully for ${purpose}`,
    );
  }
}

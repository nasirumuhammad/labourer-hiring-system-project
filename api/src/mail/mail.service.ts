import { maskEmail } from '@/auth/common/utils/mask.util';
import { envConfig } from '@/common/config/env.config';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CreateEmailOptions, Resend } from 'resend';

@Injectable()
export class Mailservice {
  private readonly logger = new Logger(Mailservice.name);
  constructor(
    private readonly resend: Resend,
    @Inject(envConfig.KEY)
    private readonly env: ConfigType<typeof envConfig>,
  ) {}

  async send(payload: Omit<CreateEmailOptions, 'from'>): Promise<void> {
    const resendPayload = {
      ...payload,
      from: this.env.resend.email,
    } as CreateEmailOptions;

    const { error } = await this.resend.emails.send(resendPayload);

    if (error) {
      this.logger.error(
        {
          email: maskEmail(payload.to as string),
          subject: payload.subject,
          err: error,
        },
        'Failed to send email via Resend',
      );
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  private buildOtpHtml(otp: string): string {
    return `<p>Your code is: <strong>${otp}</strong></p>`;
  }

  async sendForgotPasswordEmail(
    payload: { email: string; otp: string },
    subject: 'Reset your password',
  ): Promise<void> {
    const { email, otp } = payload;
    await this.send({
      to: email,
      subject,
      html: this.buildOtpHtml(otp),
    });
  }
}

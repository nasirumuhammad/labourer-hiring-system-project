import { Module } from '@nestjs/common';
import { Mailservice } from './mail.service';
import { MailProcessor } from './mail.processor';
import { BullModule } from '@nestjs/bullmq';
import { ConfigType } from '@nestjs/config';
import { Resend } from 'resend';
import { envConfig } from '@/common/config/env.config';
import { SystemQueues } from '@/common/constants/system-queue.constant';
import { ForgotPasswordRequestListener } from './listeners/forgot-password.listener';
import { RESEND_CLIENT } from './constants/mail.constant';

@Module({
  imports: [BullModule.registerQueue({ name: SystemQueues.EMAIL })],
  providers: [
    Mailservice,
    MailProcessor,
    ForgotPasswordRequestListener,
    {
      provide: RESEND_CLIENT,
      inject: [envConfig.KEY],
      useFactory: (env: ConfigType<typeof envConfig>) => {
        const apiKey = env.resend.apiKey;
        return new Resend(apiKey);
      },
    },
  ],
  exports: [Mailservice],
})
export class MailModule {}

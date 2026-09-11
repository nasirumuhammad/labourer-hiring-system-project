import { Module } from '@nestjs/common';
import { Mailservice } from './mail.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Resend } from 'resend';
import { envConfig } from '@/common/config/env.config';

@Module({
  imports: [BullModule.registerQueue({ name: 'email' })],
  providers: [
    Mailservice,
    {
      provide: 'REDIS_CLIENT',
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

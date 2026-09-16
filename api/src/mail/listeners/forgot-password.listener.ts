import { BaseOtpQueueListener } from './base-otp.listener';
import { InjectQueue } from '@nestjs/bullmq';
import { SystemQueues } from '@/common/constants/system-queue.constant';
import { Queue } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ForgotPasswordResetTokenEventPayload,
  SystemEvents,
} from '@/auth/common/constants/system-events.constant';
import { SystemJobs } from '@/common/constants/system-jobs.constant';
import { maskEmail } from '@/auth/common/utils/mask.util';
import { MailJobPayload } from '../constants/mail.constant';

@Injectable()
export class ForgotPasswordRequestListener extends BaseOtpQueueListener<MailJobPayload> {
  constructor(@InjectQueue(SystemQueues.EMAIL) queue: Queue) {
    super(queue, new Logger(ForgotPasswordRequestListener.name));
  }

  @OnEvent(SystemEvents.SEND_FORGOT_PASSWORD_RESET_TOKEN)
  async handle(event: ForgotPasswordResetTokenEventPayload) {
    try {
      await this.enqueueJob(SystemJobs.SEND_FORGOT_PASSWORD_OTP, event);
      this.logger.log(
        {
          jobName: SystemJobs.SEND_FORGOT_PASSWORD_OTP,
          email: maskEmail(event.email),
        },
        'Enqueued forgot password OTP job',
      );
    } catch (error: any) {
      this.logger.error(
        { email: maskEmail(event.email), err: error },
        'Failed to process forgot password OTP request',
      );
    }
  }

  @OnEvent(SystemEvents.RESEND_FORGOT_PASSWORD_OTP)
  async handleResend(event: ForgotPasswordResetTokenEventPayload) {
    try {
      await this.enqueueJob(SystemJobs.RESEND_OTP, event);
      this.logger.log(
        {
          jobName: SystemJobs.RESEND_OTP,
          email: maskEmail(event.email),
        },
        'Enqueued resend OTP job',
      );
    } catch (error: any) {
      this.logger.error(
        { email: maskEmail(event.email), err: error },
        'Failed to process resend OTP request',
      );
    }
  }
}

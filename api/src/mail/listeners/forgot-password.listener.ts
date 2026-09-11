import { BaseOtpQueueListener } from './base-otp.listener';
import { EmailJobPayload } from '../constants/email.constant';
import { InjectQueue } from '@nestjs/bullmq';
import { SystemQueues } from '@/common/constants/system-queue.constant';
import { Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ForgotPasswordResetTokenEventPayload } from '@/auth/common/constants/system-events.constant';
import { SystemJobs } from '@/common/constants/system-jobs.constant';
import { maskEmail } from '@/auth/common/utils/mask.util';

export class ForgotPasswordRequestListener extends BaseOtpQueueListener<EmailJobPayload> {
  constructor(@InjectQueue(SystemQueues.EMAIL) queue: Queue) {
    super(queue, new Logger(ForgotPasswordRequestListener.name));
  }

  @OnEvent(SystemQueues.EMAIL)
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
}

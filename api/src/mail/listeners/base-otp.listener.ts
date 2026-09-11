import { Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EmailJobPayload } from '../constants/email.constant';
import { SystemJob } from '@/common/constants/system-jobs.constant';
import { maskEmail } from '@/auth/common/utils/mask.util';

export abstract class BaseOtpQueueListener<T extends EmailJobPayload> {
  constructor(
    protected readonly queue: Queue<EmailJobPayload>,
    protected logger: Logger,
  ) {}

  protected async enqueueJob(jobName: SystemJob, payload: T) {
    try {
      await this.queue.add(jobName, payload);
      this.logger.log(
        {
          jobName,
          email: maskEmail(payload.email),
        },
        `Added ${jobName} job to queue`,
      );
    } catch (error: any) {
      this.logger.error(
        {
          jobName,
          email: maskEmail(payload.email),
          err: error,
        },
        `Failed to add ${jobName} job to queue`,
      );
      throw new Error(error);
    }
  }
}

import { SystemJobs } from '@/common/constants/system-jobs.constant';
import { SystemQueues } from '@/common/constants/system-queue.constant';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { maskEmail } from '@/auth/common/utils/mask.util';
import { Mailservice } from './mail.service';

@Injectable()
@Processor(SystemQueues.EMAIL)
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: Mailservice) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const { email, otp } = job.data;

    try {
      switch (job.name) {
        case SystemJobs.SEND_FORGOT_PASSWORD_OTP:
          await this.mailService.sendForgotPasswordEmail(
            { email, otp },
            'Reset your password',
          );

          this.logger.log(
            {
              jobId: job.id,
              jobName: job.name,
              email: maskEmail(email),
            },
            `Processed ${job.name} job`,
          );
          break;
        case SystemJobs.RESEND_OTP:
          await this.mailService.sendForgotPasswordEmail(
            { email, otp },
            'Reset your password',
          );

          this.logger.log(
            {
              jobId: job.id,
              jobName: job.name,
              email: maskEmail(email),
            },
            `Processed ${job.name} job`,
          );
          break;
        default:
          this.logger.warn(
            { jobId: job.id, jobName: job.name },
            `Unknown job name received on ${SystemQueues.EMAIL}`,
          );
      }
    } catch (error: any) {
      this.logger.error(
        {
          jobId: job.id,
          jobName: job.name,
          email: maskEmail(email),
          err: error,
        },
        `Failed to process ${job.name} job`,
      );

      throw error;
    }
  }
}

import { SystemJobs } from '@/common/constants/system-jobs.constant';
import { SystemQueues } from '@/common/constants/system-queue.constant';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { Mailservice } from './mail.service';

@Injectable()
@Processor(SystemQueues.EMAIL)
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: Mailservice) {
    super();
  }
  process(job: Job, token?: string): Promise<any> {
    const { email, otp } = job.data;
    try {
      await this.mailService.sendForgotPasswordEmail({ email, otp }, '');
    } catch (error: any) {}
  }
}

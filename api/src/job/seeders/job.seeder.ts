import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserService } from '@/user/user.service';
import { JobService } from '../job.service';
import { dummyJobs } from './dummy-jobs';

@Injectable()
export class JobSeeder {
  private readonly logger = new Logger(JobSeeder.name);

  constructor(
    private readonly userService: UserService,
    private readonly jobService: JobService,
    private readonly configService: ConfigService,
  ) {}

  async run(): Promise<void> {
    const email = this.configService.getOrThrow<string>('ADMIN_EMAIL');

    const employer = await this.userService.findByEmail(email);

    if (!employer) {
      throw new Error(
        'Admin account not found. Make sure AdminSeeder runs before JobSeeder.',
      );
    }

    const existingJobs = await this.jobService.count();

    if (existingJobs > 0) {
      this.logger.log('jobs already seeded, skipping');
      return;
    }

    for (const job of dummyJobs) {
      await this.jobService.create(employer.id, job);
    }

    this.logger.log(`${dummyJobs.length} jobs seeded successfully`);
  }
}

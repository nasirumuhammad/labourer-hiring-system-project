import { JobsOptions } from 'bullmq';

export type EmailJobPayload = { email: string; otp: string };

export const emailJobConfig: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000 * 20,
  },
  removeOnComplete: 100,
  removeOnFail: 100,
};

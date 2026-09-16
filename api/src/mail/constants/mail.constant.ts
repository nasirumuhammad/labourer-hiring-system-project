import { JobsOptions } from 'bullmq';

export const RESEND_CLIENT = 'RESEND_CLIENT';

export type MailJobPayload = { email: string; otp: string };

export const MailJobConfig: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000 * 20,
  },
  removeOnComplete: 100,
  removeOnFail: 100,
};

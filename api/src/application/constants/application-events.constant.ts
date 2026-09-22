import { ApplicationStatus } from '@labour-hiring/enums';

export const ApplicationEvents = {
  STATUS_UPDATED: 'application.status.updated',
} as const;

export class ApplicationStatusUpdatedEvent {
  constructor(
    public readonly applicationId: string,
    public readonly applicantId: string,
    public readonly jobId: string,
    public readonly status: ApplicationStatus,
  ) {}
}

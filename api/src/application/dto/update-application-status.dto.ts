import { IsIn } from 'class-validator';
import { ApplicationStatus } from '@labour-hiring/enums';

const EMPLOYER_SETTABLE_STATUSES = [
  ApplicationStatus.ACCEPTED,
  ApplicationStatus.REJECTED,
] as const;

export class UpdateApplicationStatusDto {
  @IsIn(EMPLOYER_SETTABLE_STATUSES)
  status!: ApplicationStatus.ACCEPTED | ApplicationStatus.REJECTED;
}

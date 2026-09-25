import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationStatus } from '@labour-hiring/enums';
import { Application } from './entities/application.entity';
import { ApplyJobDto } from './dto/apply-job.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';
import { JobService } from '@/job/job.service';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, filter, fromEvent, map, merge, timer } from 'rxjs';
import {
  ApplicationEvents,
  ApplicationStatusUpdatedEvent,
} from './constants/application-events.constant';

export type SafeApplication = Application;

export interface PaginatedApplications {
  data: SafeApplication[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly jobService: JobService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async apply(
    jobId: string,
    applicantId: string,
    dto: ApplyJobDto,
  ): Promise<SafeApplication> {
    const job = await this.jobService.findOne(jobId);

    const existing = await this.applicationRepository.findOneBy({
      jobId: job.id,
      applicantId,
    });
    if (existing) {
      this.logger.warn(
        { jobId: job.id, applicantId },
        'duplicate application attempted',
      );
      throw new ConflictException('You have already applied to this job');
    }

    const application = this.applicationRepository.create({
      jobId: job.id,
      applicantId,
      proposal: dto.proposal,
    });
    const saved = await this.applicationRepository.save(application);

    this.logger.log(
      { jobId: job.id, applicantId, applicationId: saved.id },
      'job application submitted',
    );

    return saved;
  }

  async findMine(
    applicantId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedApplications> {
    const [data, total] = await this.applicationRepository.findAndCount({
      where: { applicantId },
      relations: { job: true },
      order: { createdAt: 'DESC' },
      skip: query.skip,
      take: query.limit,
    });

    return {
      data,
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  // An employer viewing who applied to one of their own jobs. Ownership is
  // enforced by jobService.findOwned() before any application row is read,
  // so a non-owner gets the same NotFoundException as a bad job id.
  async findForJob(
    jobId: string,
    employerId: string,
    query: QueryApplicationsDto,
  ): Promise<PaginatedApplications> {
    await this.jobService.findOwned(jobId, employerId);

    const [data, total] = await this.applicationRepository.findAndCount({
      where: {
        jobId,
        ...(query.status ? { status: query.status } : {}),
      },
      relations: { applicant: true },
      order: { createdAt: 'DESC' },
      skip: query.skip,
      take: query.limit,
    });

    return {
      data,
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  // Accept/reject — the only decision an employer can make, and only once.
  // Loading via the 'job' relation lets us check ownership without a
  // second query, and NotFoundException (rather than Forbidden) avoids
  // confirming to a non-owner that the application id exists at all.
  async updateStatus(
    applicationId: string,
    employerId: string,
    status: ApplicationStatus.ACCEPTED | ApplicationStatus.REJECTED,
  ): Promise<SafeApplication> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: { job: true },
    });

    if (!application || application.job.employerId !== employerId) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new ConflictException(
        `This application has already been ${application.status}`,
      );
    }

    application.status = status;
    const saved = await this.applicationRepository.save(application);

    this.logger.log(
      { applicationId, jobId: application.jobId, employerId, status },
      'application status updated',
    );
    this.eventEmitter.emit(
      ApplicationEvents.STATUS_UPDATED,
      new ApplicationStatusUpdatedEvent(
        saved.id,
        saved.applicantId,
        saved.jobId,
        saved.status,
      ),
    );
    return saved;
  }

  // Live status updates for the applicant's own "My Applications" view.
  // Filtered to this applicant's own events only — every connected client
  // shares the same underlying emitter, so without this filter one
  // labourer would see every other labourer's status changes too.
  //
  // A periodic ping keeps the connection alive through proxies/load
  // balancers that would otherwise time out an idle stream.
  streamStatusUpdates(applicantId: string): Observable<MessageEvent> {
    const statusUpdates$ = fromEvent<ApplicationStatusUpdatedEvent>(
      this.eventEmitter,
      ApplicationEvents.STATUS_UPDATED,
    ).pipe(
      filter((event) => event.applicantId === applicantId),
      map((event): MessageEvent => ({
        type: 'application-status-updated',
        data: event,
      })),
    );

    const heartbeat$ = timer(0, 20_000).pipe(
      map((): MessageEvent => ({
        type: 'ping',
        data: {},
      })),
    );

    return merge(statusUpdates$, heartbeat$);
  }
}

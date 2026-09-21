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

export type SafeApplication = Omit<
  Application,
  'bankName' | 'bankAccountNumber' | 'bvn'
>;

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
      bankName: dto.bankName,
      bankAccountNumber: dto.bankAccountNumber,
      bvn: dto.bvn,
    });
    const saved = await this.applicationRepository.save(application);

    this.logger.log(
      { jobId: job.id, applicantId, applicationId: saved.id },
      'job application submitted',
    );

    return this.toSafeApplication(saved);
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
      data: data.map((application) => this.toSafeApplication(application)),
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
      data: data.map((application) => this.toSafeApplication(application)),
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

    return this.toSafeApplication(saved);
  }

  private toSafeApplication(application: Application): SafeApplication {
    const { bankName, bankAccountNumber, bvn, ...safe } = application;
    return safe;
  }
}

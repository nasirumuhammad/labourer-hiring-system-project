import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { ApplyJobDto } from './dto/apply-job.dto';
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

  // Bank details are select:false so ordinary finds already omit them, but
  // .create()/.save() still returns whatever was set on the in-memory
  // entity — strip them explicitly before anything reaches a controller.
  private toSafeApplication(application: Application): SafeApplication {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { bankName, bankAccountNumber, bvn, ...safe } = application;
    return safe;
  }
}

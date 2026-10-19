import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobStatus, PaymentType } from '@labour-hiring/enums';
import { Job } from './entities/job.entity';
import { Application } from '@/application/entities/application.entity';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { QueryJobsDto } from './dto/query-jobs.dto';
import { QueryMyJobsDto } from './dto/query-my-job.dto';

export interface FacetCount<T = string> {
  value: T;
  count: number;
}

export interface JobFacets {
  paymentType: FacetCount<PaymentType>[];
  skills: FacetCount[];
}

export interface PaginatedJobs {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  facets: JobFacets;
}

export interface PaginatedMyJobs {
  data: Job[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async create(employerId: string, dto: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create({ ...dto, employerId });
    const saved = await this.jobRepository.save(job);

    this.logger.debug({ jobId: saved.id, employerId }, 'job posted');

    return saved;
  }

  // One of the employer's own jobs (any status), plus how many people have
  // applied so the edit screen can lock the pay fields.
  async findMineOne(
    id: string,
    employerId: string,
  ): Promise<Job & { applicantCount: number }> {
    const job = await this.findOwned(id, employerId);
    const applicantCount = await this.applicationRepository.count({
      where: { jobId: id },
    });
    return Object.assign(job, { applicantCount });
  }

  // Pay is locked as soon as anyone has applied, so an applicant never
  // applies to one price and finds it changed afterwards.
  async update(
    id: string,
    employerId: string,
    dto: UpdateJobDto,
  ): Promise<Job> {
    const job = await this.findOwned(id, employerId);

    const payChanged =
      (dto.minPay !== undefined && Number(dto.minPay) !== Number(job.minPay)) ||
      (dto.maxPay !== undefined && Number(dto.maxPay) !== Number(job.maxPay)) ||
      (dto.paymentType !== undefined && dto.paymentType !== job.paymentType);

    if (payChanged) {
      const applicants = await this.applicationRepository.count({
        where: { jobId: id },
      });
      if (applicants > 0) {
        throw new ConflictException(
          'The pay for this job cannot be changed because people have already applied',
        );
      }
    }

    Object.assign(job, dto);

    if (Number(job.maxPay) < Number(job.minPay)) {
      throw new ConflictException(
        'Maximum pay must be at least the minimum pay',
      );
    }

    const saved = await this.jobRepository.save(job);
    this.logger.debug({ jobId: id, employerId }, 'job updated');
    return saved;
  }

  async remove(id: string, employerId: string): Promise<{ id: string }> {
    const job = await this.findOwned(id, employerId);
    await this.jobRepository.softRemove(job);
    this.logger.debug({ jobId: id, employerId }, 'job deleted');
    return { id };
  }

  async count(): Promise<number> {
    return this.jobRepository.count();
  }

  async findAll(query: QueryJobsDto): Promise<PaginatedJobs> {
    const qb = this.buildFilteredQuery(query);

    qb.orderBy('job.createdAt', query.sort === 'oldest' ? 'ASC' : 'DESC')
      .skip(query.skip)
      .take(query.limit);

    const [data, total] = await qb.getManyAndCount();
    const facets = await this.getFacets();

    return { data, total, page: query.page, limit: query.limit, facets };
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id, status: JobStatus.OPEN },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async findOwned(id: string, employerId: string): Promise<Job> {
    const job = await this.jobRepository.findOneBy({ id });

    if (!job || job.employerId !== employerId) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async findMine(
    employerId: string,
    query: QueryMyJobsDto,
  ): Promise<PaginatedMyJobs> {
    const [data, total] = await this.jobRepository.findAndCount({
      where: { employerId, ...(query.status ? { status: query.status } : {}) },
      order: { createdAt: 'DESC' },
      skip: query.skip,
      take: query.limit,
    });

    return { data, total, page: query.page, limit: query.limit };
  }

  private buildFilteredQuery(query: QueryJobsDto) {
    const qb = this.jobRepository
      .createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.OPEN });

    if (query.search) {
      qb.andWhere(
        '(job.title ILIKE :search OR job.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.paymentType?.length) {
      qb.andWhere('job.paymentType IN (:...paymentTypes)', {
        paymentTypes: query.paymentType,
      });
    }

    if (query.skills?.length) {
      qb.andWhere('job.skills && :skills', { skills: query.skills });
    }

    return qb;
  }

  // Facet counts reflect all open jobs, not the currently active filters —
  // a simplification for now. A fully "smart" faceted search (counts that
  // exclude the facet's own filter but respect the others) can follow once
  // there's real traffic to justify the extra query complexity.
  private async getFacets(): Promise<JobFacets> {
    const paymentTypeCounts = await this.jobRepository
      .createQueryBuilder('job')
      .select('job.paymentType', 'paymentType')
      .addSelect('COUNT(*)', 'count')
      .where('job.status = :status', { status: JobStatus.OPEN })
      .groupBy('job.paymentType')
      .getRawMany<{ paymentType: PaymentType; count: string }>();

    const skillCounts = await this.jobRepository
      .createQueryBuilder()
      .select('skill')
      .addSelect('COUNT(*)', 'count')
      .from(
        (qb) =>
          qb
            .subQuery()
            .select('unnest(job.skills)', 'skill')
            .from(Job, 'job')
            .where('job.status = :status', { status: JobStatus.OPEN }),
        'expanded',
      )
      .groupBy('skill')
      .orderBy('count', 'DESC')
      .setParameter('status', JobStatus.OPEN)
      .getRawMany<{ skill: string; count: string }>();

    return {
      paymentType: paymentTypeCounts.map((row) => ({
        value: row.paymentType,
        count: Number(row.count),
      })),
      skills: skillCounts.map((row) => ({
        value: row.skill,
        count: Number(row.count),
      })),
    };
  }

  // Candidate pool for recommendations: newest open jobs, minus anything
  // the client already applied to. Scoring/ranking happens in the
  // recommendation service — this just narrows the field cheaply in SQL.
  async findOpenExcluding(excludeIds: string[], take: number): Promise<Job[]> {
    const qb = this.jobRepository
      .createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.OPEN });

    if (excludeIds.length > 0) {
      qb.andWhere('job.id NOT IN (:...excludeIds)', { excludeIds });
    }

    return qb.orderBy('job.createdAt', 'DESC').take(take).getMany();
  }
}

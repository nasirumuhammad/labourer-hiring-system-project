import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobStatus, PaymentType } from '@labour-hiring/enums';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { QueryJobsDto } from './dto/query-jobs.dto';

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

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async create(employerId: string, dto: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create({ ...dto, employerId });
    const saved = await this.jobRepository.save(job);

    this.logger.debug({ jobId: saved.id, employerId }, 'job posted');

    return saved;
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
}

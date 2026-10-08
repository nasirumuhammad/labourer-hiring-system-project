import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedJob } from './entities/saved-job.entity';
import { JobService } from '@/job/job.service';
import { Job } from '@/job/entities/job.entity';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export interface PaginatedSavedJobs {
  data: Job[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class SavedJobService {
  private readonly logger = new Logger(SavedJobService.name);

  constructor(
    @InjectRepository(SavedJob)
    private readonly savedJobRepository: Repository<SavedJob>,
    private readonly jobService: JobService,
  ) {}

  // Idempotent: saving an already-saved job is a no-op, not an error.
  async save(userId: string, jobId: string): Promise<{ saved: true }> {
    const job = await this.jobService.findOne(jobId);

    const existing = await this.savedJobRepository.findOneBy({
      userId,
      jobId: job.id,
    });
    if (!existing) {
      await this.savedJobRepository.save(
        this.savedJobRepository.create({ userId, jobId: job.id }),
      );
      this.logger.debug({ userId, jobId: job.id }, 'job saved');
    }

    return { saved: true };
  }

  // Idempotent as well: unsaving something that isn't saved is fine.
  async unsave(userId: string, jobId: string): Promise<{ saved: false }> {
    await this.savedJobRepository.softDelete({ userId, jobId });
    return { saved: false };
  }

  async findMine(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedSavedJobs> {
    const [rows, total] = await this.savedJobRepository
      .createQueryBuilder('saved')
      .innerJoinAndSelect('saved.job', 'job')
      .where('saved.userId = :userId', { userId })
      .orderBy('saved.createdAt', 'DESC')
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();

    return {
      data: rows.map((row) => row.job),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async countMine(userId: string): Promise<number> {
    return this.savedJobRepository.countBy({ userId });
  }

  async findSavedJobIds(userId: string): Promise<Set<string>> {
    const rows = await this.savedJobRepository.find({
      where: { userId },
      select: { jobId: true },
    });
    return new Set(rows.map((row) => row.jobId));
  }
}

import { Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@labour-hiring/enums';
import { ApplicationService } from '@/application/application.service';
import { SavedJobService } from '@/saved-job/saved-job.service';
import { RecommendationService } from '@/recommendation/recommendation.service';
import { UserService } from '@/user/user.service';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Application } from '@/application/entities/application.entity';
import { Job } from '@/job/entities/job.entity';

const RECENT_APPLICATIONS_LIMIT = 5;
const RECOMMENDED_JOBS_LIMIT = 5;

export interface DashboardSummary {
  profileCompletion: number;
  stats: {
    total: number;
    pending: number;
    shortlisted: number;
    rejected: number;
    saved: number;
  };
  recentApplications: Application[];
  recommendedJobs: (Job & { isSaved: boolean })[];
}

// A labourer's profile is created in one submission (CreateProfileDto
// requires every field), so completion is binary rather than a partial
// percentage — there's no "half-filled" state to report.
const NO_PROFILE_COMPLETION = 0;
const HAS_PROFILE_COMPLETION = 100;

@Injectable()
export class DashboardService {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly savedJobService: SavedJobService,
    private readonly recommendationService: RecommendationService,
    private readonly userService: UserService,
  ) {}

  async getSummary(labourerId: string): Promise<DashboardSummary> {
    const recentApplicationsQuery = Object.assign(new PaginationQueryDto(), {
      page: 1,
      limit: RECENT_APPLICATIONS_LIMIT,
    });

    const [
      user,
      applicationStats,
      savedJobIds,
      recentApplications,
      recommendedJobs,
    ] = await Promise.all([
      this.userService.findById(labourerId),
      this.applicationService.getStatsForApplicant(labourerId),
      this.savedJobService.findSavedJobIds(labourerId),
      this.applicationService.findMine(labourerId, recentApplicationsQuery),
      this.recommendationService.getRecommendedJobs(
        labourerId,
        RECOMMENDED_JOBS_LIMIT,
      ),
    ]);

    return {
      profileCompletion: user?.profile
        ? HAS_PROFILE_COMPLETION
        : NO_PROFILE_COMPLETION,
      stats: {
        total: applicationStats.total,
        pending: applicationStats[ApplicationStatus.PENDING],
        shortlisted: applicationStats[ApplicationStatus.ACCEPTED],
        rejected: applicationStats[ApplicationStatus.REJECTED],
        saved: savedJobIds.size,
      },
      recentApplications: recentApplications.data,
      recommendedJobs: recommendedJobs.map((job) => ({
        ...job,
        isSaved: savedJobIds.has(job.id),
      })),
    };
  }
}

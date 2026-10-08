import { Injectable, Logger } from '@nestjs/common';
import { Job } from '@/job/entities/job.entity';
import { JobService } from '@/job/job.service';
import { UserService } from '@/user/user.service';
import { ApplicationService } from '@/application/application.service';

const CANDIDATE_POOL_SIZE = 50;
const STATE_MATCH_SCORE = 3;
const LGA_MATCH_SCORE = 2;

interface ScoredJob {
  job: Job;
  score: number;
}

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(
    private readonly jobService: JobService,
    private readonly userService: UserService,
    private readonly applicationService: ApplicationService,
  ) {}

  async getRecommendedJobs(labourerId: string, limit: number): Promise<Job[]> {
    const appliedJobIds =
      await this.applicationService.findAppliedJobIds(labourerId);
    const candidates = await this.jobService.findOpenExcluding(
      [...appliedJobIds],
      CANDIDATE_POOL_SIZE,
    );

    const user = await this.userService.findById(labourerId);
    const profile = user?.profile;

    // No profile yet (or nothing to match on): freshest open jobs stand in
    // for personalization until there's a profile to score against.
    if (!profile?.state && !profile?.lga) {
      return candidates.slice(0, limit);
    }

    const scored: ScoredJob[] = candidates.map((job) => ({
      job,
      score: this.scoreJobForProfile(job, profile.state, profile.lga),
    }));

    scored.sort((a, b) => b.score - a.score);

    this.logger.debug(
      { labourerId, candidateCount: candidates.length },
      'recommendations scored',
    );

    return scored.slice(0, limit).map((entry) => entry.job);
  }

  private scoreJobForProfile(job: Job, state: string, lga: string): number {
    const location = job.location?.toLowerCase() ?? '';
    let score = 0;

    if (state && location.includes(state.toLowerCase())) {
      score += STATE_MATCH_SCORE;
    }
    if (lga && location.includes(lga.toLowerCase())) {
      score += LGA_MATCH_SCORE;
    }

    return score;
  }
}

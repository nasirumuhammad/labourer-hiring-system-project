import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@labour-hiring/enums';
import { Payload } from '@labour-hiring/types';
import { RecommendationService } from './recommendation.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;

@Controller('jobs/recommended')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LABOURER)
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  findRecommended(
    @CurrentUser() user: Payload,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const take = Math.min(limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    return this.recommendationService.getRecommendedJobs(user.sub, take);
  }
}

import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@labour-hiring/enums';
import { Payload } from '@labour-hiring/types';
import { SavedJobService } from './saved-job.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LABOURER)
export class SavedJobController {
  constructor(private readonly savedJobService: SavedJobService) {}

  @Put('jobs/:id/save')
  save(
    @Param('id', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: Payload,
  ) {
    return this.savedJobService.save(user.sub, jobId);
  }

  @Delete('jobs/:id/save')
  unsave(
    @Param('id', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: Payload,
  ) {
    return this.savedJobService.unsave(user.sub, jobId);
  }

  @Get('saved-jobs')
  findMine(@CurrentUser() user: Payload, @Query() query: PaginationQueryDto) {
    return this.savedJobService.findMine(user.sub, query);
  }
}

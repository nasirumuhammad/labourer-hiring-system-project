import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@labour-hiring/enums';
import { ApplicationService } from './application.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Payload } from '@labour-hiring/types';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Observable } from 'rxjs';
import { SkipResponseTransform } from '@/common/decorators/skip-response-transformation.decorator';

@Controller()
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LABOURER)
  @Post('jobs/:id/apply')
  apply(
    @Param('id', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: Payload,
    @Body() dto: ApplyJobDto,
  ) {
    return this.applicationService.apply(jobId, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('applications/me')
  findMine(@CurrentUser() user: Payload, @Query() query: PaginationQueryDto) {
    return this.applicationService.findMine(user.sub, query);
  }

  @SkipResponseTransform()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LABOURER)
  @Sse('applications/stream')
  stream(@CurrentUser() user: Payload): Observable<MessageEvent> {
    return this.applicationService.streamStatusUpdates(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @Get('jobs/:id/applications')
  findForJob(
    @Param('id', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: Payload,
    @Query() query: QueryApplicationsDto,
  ) {
    return this.applicationService.findForJob(jobId, user.sub, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @Patch('applications/:id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Payload,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateStatus(id, user.sub, dto.status);
  }
}

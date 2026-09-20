import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@labour-hiring/enums';
import { ApplicationService } from './application.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Payload } from '@labour-hiring/types';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

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
}

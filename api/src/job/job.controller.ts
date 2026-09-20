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
import { JobService } from './job.service';
import { QueryJobsDto } from './dto/query-jobs.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Payload } from '@labour-hiring/types';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findAll(@Query() query: QueryJobsDto) {
    return this.jobService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @Post()
  create(@CurrentUser() user: Payload, @Body() dto: CreateJobDto) {
    return this.jobService.create(user.sub, dto);
  }
}

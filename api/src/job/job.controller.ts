import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@labour-hiring/enums';
import { JobService } from './job.service';
import { QueryJobsDto } from './dto/query-jobs.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Payload } from '@labour-hiring/types';
import { QueryMyJobsDto } from './dto/query-my-job.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findAll(@Query() query: QueryJobsDto) {
    return this.jobService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @Get('mine')
  findMine(@CurrentUser() user: Payload, @Query() query: QueryMyJobsDto) {
    return this.jobService.findMine(user.sub, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @Get('mine/:id')
  findMineOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Payload,
  ) {
    return this.jobService.findMineOne(id, user.sub);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Payload,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobService.update(id, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: Payload,
  ) {
    return this.jobService.remove(id, user.sub);
  }
}

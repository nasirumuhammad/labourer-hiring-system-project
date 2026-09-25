import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { JobStatus, UserRole } from '@labour-hiring/enums';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Payload } from '@labour-hiring/types';
import { AdminService } from './admin.service';
import { QueryUsersDto } from './dto/query-users.dto';
import { QueryJobsDto } from './dto/query-jobs.dto';
import { QueryAdminApplicationsDto } from './dto/query-applications.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard') dashboard() { return this.adminService.dashboard(); }
  @Get('users') users(@Query() query: QueryUsersDto) { return this.adminService.listUsers(query); }
  @Get('users/:id') user(@Param('id', ParseUUIDPipe) id: string) { return this.adminService.getUser(id); }
  @Patch('users/:id/deactivate') deactivateUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: Payload) { return this.adminService.setUserStatus(id, false, actor.sub); }
  @Patch('users/:id/reactivate') reactivateUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: Payload) { return this.adminService.setUserStatus(id, true, actor.sub); }

  @Get('labourers') labourers(@Query() query: QueryUsersDto) { query.role = UserRole.LABOURER; return this.adminService.listUsers(query); }
  @Get('employers') employers(@Query() query: QueryUsersDto) { query.role = UserRole.EMPLOYER; return this.adminService.listUsers(query); }
  @Get('admins') admins(@Query() query: QueryUsersDto) { query.role = UserRole.ADMIN; return this.adminService.listUsers(query); }

  @Get('jobs') jobs(@Query() query: QueryJobsDto) { return this.adminService.listJobs(query); }
  @Get('jobs/:id') job(@Param('id', ParseUUIDPipe) id: string) { return this.adminService.getJob(id); }
  @Patch('jobs/:id/status') jobStatus(@Param('id', ParseUUIDPipe) id: string, @Body('status') status: JobStatus, @CurrentUser() actor: Payload) { return this.adminService.setJobStatus(id, status, actor.sub); }
  @Delete('jobs/:id') deleteJob(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: Payload) { return this.adminService.deleteJob(id, actor.sub); }

  @Get('applications') applications(@Query() query: QueryAdminApplicationsDto) { return this.adminService.listApplications(query); }
  @Get('applications/:id') application(@Param('id', ParseUUIDPipe) id: string) { return this.adminService.getApplication(id); }
  @Delete('applications/:id') deleteApplication(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: Payload) { return this.adminService.deleteApplication(id, actor.sub); }

  @Get('audit-logs') auditLogs(@Query('page', new ParseIntPipe({ optional: true })) page = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit = 20) { return this.adminService.listAuditLogs(page, limit); }
}

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationStatus, JobStatus, UserRole } from '@labour-hiring/enums';
import { Repository } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Job } from '@/job/entities/job.entity';
import { Application } from '@/application/entities/application.entity';
import { AuditLog } from './entities/audit-log.entity';
import { QueryUsersDto } from './dto/query-users.dto';
import { QueryJobsDto } from './dto/query-jobs.dto';
import { QueryAdminApplicationsDto } from './dto/query-applications.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Job) private readonly jobs: Repository<Job>,
    @InjectRepository(Application) private readonly applications: Repository<Application>,
    @InjectRepository(AuditLog) private readonly auditLogs: Repository<AuditLog>,
  ) {}

  async dashboard() {
    const [activeUsers, labourers, employers, admins, deactivated] = await Promise.all([
      this.users.count(),
      this.users.count({ where: { role: UserRole.LABOURER } }),
      this.users.count({ where: { role: UserRole.EMPLOYER } }),
      this.users.count({ where: { role: UserRole.ADMIN } }),
      this.users.createQueryBuilder('user').withDeleted().where('user.deletedAt IS NOT NULL').getCount(),
    ]);

    const [totalJobs, openJobs, closedJobs, draftJobs] = await Promise.all([
      this.jobs.count(),
      this.jobs.count({ where: { status: JobStatus.OPEN } }),
      this.jobs.count({ where: { status: JobStatus.CLOSED } }),
      this.jobs.count({ where: { status: JobStatus.DRAFT } }),
    ]);

    const [totalApplications, pending, accepted, rejected] = await Promise.all([
      this.applications.count(),
      this.applications.count({ where: { status: ApplicationStatus.PENDING } }),
      this.applications.count({ where: { status: ApplicationStatus.ACCEPTED } }),
      this.applications.count({ where: { status: ApplicationStatus.REJECTED } }),
    ]);

    const [recentUsers, recentJobs, recentApplications] = await Promise.all([
      this.users.find({ relations: { profile: true }, order: { createdAt: 'DESC' }, take: 5 }),
      this.jobs.find({ relations: { employer: true }, order: { createdAt: 'DESC' }, take: 5 }),
      this.applications.find({ relations: { applicant: true, job: true }, order: { createdAt: 'DESC' }, take: 5 }),
    ]);

    return {
      users: { total: activeUsers + deactivated, labourers, employers, admins, active: activeUsers, deactivated },
      jobs: { total: totalJobs, open: openJobs, closed: closedJobs, draft: draftJobs },
      applications: { total: totalApplications, pending, accepted, rejected },
      recentUsers,
      recentJobs,
      recentApplications,
    };
  }

  async listUsers(query: QueryUsersDto) {
    const qb = this.users.createQueryBuilder('user').leftJoinAndSelect('user.profile', 'profile');
    if (query.status === 'deactivated') qb.withDeleted().andWhere('user.deletedAt IS NOT NULL');
    else if (query.status === 'active') qb.andWhere('user.deletedAt IS NULL');
    if (query.role) qb.andWhere('user.role = :role', { role: query.role });
    if (query.search) qb.andWhere('(user.email ILIKE :search OR profile.firstName ILIKE :search OR profile.lastName ILIKE :search)', { search: `%${query.search}%` });
    const [data, total] = await qb.orderBy('user.createdAt', 'DESC').skip(query.skip).take(query.limit).getManyAndCount();
    return { data, total, page: query.page, limit: query.limit };
  }

  async getUser(id: string) {
    const user = await this.users.findOne({ where: { id }, withDeleted: true, relations: { profile: true } });
    if (!user) throw new NotFoundException('User not found');
    const jobs = user.role === UserRole.EMPLOYER ? await this.jobs.find({ where: { employerId: id }, withDeleted: true, order: { createdAt: 'DESC' } }) : [];
    const applications = user.role === UserRole.LABOURER ? await this.applications.find({ where: { applicantId: id }, withDeleted: true, relations: { job: true }, order: { createdAt: 'DESC' } }) : [];
    return { user, jobs, applications };
  }

  async setUserStatus(id: string, active: boolean, actorId: string) {
    if (id === actorId) throw new ForbiddenException('You cannot deactivate your own account');
    const user = await this.users.findOne({ where: { id }, withDeleted: true });
    if (!user) throw new NotFoundException('User not found');
    if (active) await this.users.restore(id); else await this.users.softDelete(id);
    await this.audit(actorId, active ? 'user.reactivated' : 'user.deactivated', 'user', id);
    return { message: active ? 'User reactivated successfully' : 'User deactivated successfully' };
  }

  async listJobs(query: QueryJobsDto) {
    const qb = this.jobs.createQueryBuilder('job').leftJoinAndSelect('job.employer', 'employer');
    if (query.status) qb.andWhere('job.status = :status', { status: query.status });
    if (query.paymentType) qb.andWhere('job.paymentType = :paymentType', { paymentType: query.paymentType });
    if (query.search) qb.andWhere('(job.title ILIKE :search OR job.companyName ILIKE :search OR job.description ILIKE :search)', { search: `%${query.search}%` });
    const [data, total] = await qb.orderBy('job.createdAt', 'DESC').skip(query.skip).take(query.limit).getManyAndCount();
    return { data, total, page: query.page, limit: query.limit };
  }

  async getJob(id: string) {
    const job = await this.jobs.findOne({ where: { id }, withDeleted: true, relations: { employer: true } });
    if (!job) throw new NotFoundException('Job not found');
    const [applications, applicationCount] = await this.applications.findAndCount({ where: { jobId: id }, withDeleted: true, relations: { applicant: true }, order: { createdAt: 'DESC' } });
    return { job, applicationCount, applications };
  }

  async setJobStatus(id: string, status: JobStatus, actorId: string) {
    const job = await this.jobs.findOne({ where: { id }, withDeleted: true });
    if (!job) throw new NotFoundException('Job not found');
    job.status = status;
    await this.jobs.save(job);
    await this.audit(actorId, `job.${status}`, 'job', id, { status });
    return job;
  }

  async deleteJob(id: string, actorId: string) {
    const result = await this.jobs.softDelete(id);
    if (!result.affected) throw new NotFoundException('Job not found');
    await this.audit(actorId, 'job.deleted', 'job', id);
    return { message: 'Job deleted successfully' };
  }

  async listApplications(query: QueryAdminApplicationsDto) {
    const qb = this.applications.createQueryBuilder('application')
      .leftJoinAndSelect('application.applicant', 'applicant')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('job.employer', 'employer');
    if (query.status) qb.andWhere('application.status = :status', { status: query.status });
    if (query.search) qb.andWhere('(applicant.email ILIKE :search OR job.title ILIKE :search OR job.companyName ILIKE :search)', { search: `%${query.search}%` });
    const [data, total] = await qb.orderBy('application.createdAt', 'DESC').skip(query.skip).take(query.limit).getManyAndCount();
    return { data, total, page: query.page, limit: query.limit };
  }

  async getApplication(id: string) {
    const application = await this.applications.findOne({ where: { id }, withDeleted: true, relations: { applicant: true, job: { employer: true } } });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async deleteApplication(id: string, actorId: string) {
    const result = await this.applications.softDelete(id);
    if (!result.affected) throw new NotFoundException('Application not found');
    await this.audit(actorId, 'application.deleted', 'application', id);
    return { message: 'Application removed successfully' };
  }

  async listAuditLogs(page = 1, limit = 20) {
    const [data, total] = await this.auditLogs.findAndCount({ order: { createdAt: 'DESC' }, skip: (page - 1) * limit, take: limit });
    return { data, total, page, limit };
  }

  private async audit(adminId: string, action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>) {
    await this.auditLogs.save(this.auditLogs.create({ adminId, action, entityType, entityId, metadata }));
  }
}


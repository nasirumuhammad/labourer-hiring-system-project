import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '@/user/entities/user.entity';
import { UserProfile } from '@/user-profile/entities/user-profile.entity';
import { Job } from '@/job/entities/job.entity';
import { Application } from '@/application/entities/application.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile, Job, Application, AuditLog])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedJob } from './entities/saved-job.entity';
import { SavedJobService } from './saved-job.service';
import { SavedJobController } from './saved-job.controller';
import { JobModule } from '@/job/job.module';

@Module({
  imports: [TypeOrmModule.forFeature([SavedJob]), JobModule],
  controllers: [SavedJobController],
  providers: [SavedJobService],
  exports: [SavedJobService],
})
export class SavedJobModule {}

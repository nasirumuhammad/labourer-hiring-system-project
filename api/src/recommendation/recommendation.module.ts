import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { JobModule } from '@/job/job.module';
import { UserModule } from '@/user/user.module';
import { ApplicationModule } from '@/application/application.module';

@Module({
  imports: [JobModule, UserModule, ApplicationModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}

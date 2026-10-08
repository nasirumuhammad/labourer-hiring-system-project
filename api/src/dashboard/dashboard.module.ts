import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ApplicationModule } from '@/application/application.module';
import { SavedJobModule } from '@/saved-job/saved-job.module';
import { RecommendationModule } from '@/recommendation/recommendation.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    ApplicationModule,
    SavedJobModule,
    RecommendationModule,
    UserModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

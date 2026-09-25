import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { UserProfileMapper } from './mappers/user-profile.mapper';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile]), UserModule],
  controllers: [UserProfileController],
  providers: [UserProfileService, UserProfileMapper],
  exports: [UserProfileService],
})
export class UserProfileModule {}

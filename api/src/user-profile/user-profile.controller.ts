import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserProfileMapper } from './mappers/user-profile.mapper';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(
    private readonly profileService: UserProfileService,
    private readonly profileMapper: UserProfileMapper,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateProfileDto) {
    const user = await this.profileService.create(req.user.sub, dto);
    return this.profileMapper.toPublicUserProfileResponse(user!);
  }

  @Patch()
  async update(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const user = await this.profileService.update(req.user.sub, dto);
    return this.profileMapper.toPublicUserProfileResponse(user!);
  }
}

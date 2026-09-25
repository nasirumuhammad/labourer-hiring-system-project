import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from '@/user/user.service';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, dto: CreateProfileDto) {
    if (!dto.identityType && !dto.identityNumber) {
      throw new BadRequestException('BVN or NIN is required');
    }

    const existingProfile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('User profile already exists');
    }

    const profile = this.profileRepository.create({
      userId,
      ...dto,
    });

    await this.profileRepository.save(profile);
    return this.userService.findById(userId);
  }

  async update(userId: string, dto: UpdateProfileDto) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    Object.assign(profile, dto);
    this.profileRepository.save(profile);
    return this.userService.findById(userId);
  }
}

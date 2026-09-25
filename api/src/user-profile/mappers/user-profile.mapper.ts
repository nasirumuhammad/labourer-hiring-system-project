import { Injectable } from '@nestjs/common';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class UserProfileMapper {
  toPublicUserProfileResponse(user: User) {
    const { id, ...profile } = user.profile;
    return {
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      profile: profile,
    };
  }
}

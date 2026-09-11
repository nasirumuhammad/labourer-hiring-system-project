import { Injectable } from '@nestjs/common';
import { UserRole } from '@labour-hiring/enums';
import { User } from '@/user/entities/user.entity';
import { TokenPair } from '../types/payload.type';

export interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUserResponse {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthMapper {
  toTokenPairResponse(tokenPair: TokenPair): TokenPairResponse {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  toPublicUserResponse(user: User): PublicUserResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}

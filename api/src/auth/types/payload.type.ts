import { UserRole } from '@labour-hiring/enums';

export interface Payload {
  jti: string;
  sub: string;
  tokenVersion: number;
  role: UserRole;
}

export interface ResetPasswordPayload {
  sub: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  payload: Payload;
}

import { Payload } from '@labour-hiring/types';

export interface ResetPasswordPayload {
  sub: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  payload: Payload;
}

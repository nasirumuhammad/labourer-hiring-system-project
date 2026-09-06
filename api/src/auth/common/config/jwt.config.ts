import { registerAs } from '@nestjs/config';
import type { StringValue } from 'ms';

export const jwtConfig = registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRY as StringValue,
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET as string,
    expiresIn: process.env.JWT_REFRESH_EXPIRY as StringValue,
  },
  reset: {
    secret: process.env.JWT_RESET_SECRET as string,
    expiresIn: process.env.JWT_RESET_EXPIRY as StringValue,
  },
}));

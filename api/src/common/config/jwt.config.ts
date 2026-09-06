import { registerAs } from '@nestjs/config';
export const jwtConfig = registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRY,
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  },
  reset: {
    secret: process.env.JWT_RESET_SECRET,
    expiresIn: process.env.JWT_RESET_EXPIRY,
  },
}));

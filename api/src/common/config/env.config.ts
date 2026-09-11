import { registerAs } from '@nestjs/config';
export const envConfig = registerAs('env', () => ({
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
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  resend: {
    email: process.env.RESEND_EMAIL,
    apiKey: process.env.RESEND_API_KEY,
  },
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  database: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
}));

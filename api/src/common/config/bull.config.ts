import { SharedBullAsyncConfiguration } from '@nestjs/bullmq';
import { ConfigType } from '@nestjs/config';
import { envConfig } from './env.config';

export const bullConfig: SharedBullAsyncConfiguration = {
  inject: [envConfig.KEY],
  useFactory: (env: ConfigType<typeof envConfig>) => ({
    connection: { port: env.redis.port, host: env.redis.host },
  }),
};

import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import { envConfig } from '../config/env.config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [envConfig.KEY],
      useFactory: (env: ConfigType<typeof envConfig>) =>
        new Redis({
          host: env.redis.host,
          port: Number(env.redis.port),
        }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}

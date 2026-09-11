import { User } from '@/user/entities/user.entity';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { RefreshToken } from '@/refresh-token/entities/refresh-token.entity';
import { envConfig } from './env.config';

export const dbConfig: TypeOrmModuleAsyncOptions = {
  inject: [envConfig.KEY],
  useFactory(env: ConfigType<NonNullable<typeof envConfig>>) {
    const {
      database: { username, password, database, host, port },
    } = env;
    return {
      type: 'postgres',
      host,
      port: Number(port),
      username,
      password,
      database,
      entities: [User, RefreshToken],
      synchronize: true,
    };
  },
};

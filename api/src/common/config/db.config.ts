import { User } from '@/user/entities/user.entity';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigType, registerAs } from '@nestjs/config';
import { RefreshToken } from '@/refresh-token/entities/refresh-token.entity';

export const dbEnv = registerAs('dbEnv', () => ({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
}));

export const dbConfig: TypeOrmModuleAsyncOptions = {
  inject: [dbEnv.KEY],
  useFactory(env: ConfigType<NonNullable<typeof dbEnv>>) {
    const { username, password, database, host, port } = env;
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

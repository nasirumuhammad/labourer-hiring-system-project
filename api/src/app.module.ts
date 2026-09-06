import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig, dbEnv } from './common/config/db.config';
import { jwtConfig } from './common/config/jwt.config';
import { validateEnv } from './common/config/env.validation';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommonModule } from './auth/common/common.module';
import { UserModule } from './user/user.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './common/config/logger.config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync(dbConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, dbEnv],
      validate: validateEnv,
    }),
    LoggerModule.forRoot(loggerConfig),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync(dbConfig),
    CommonModule,
    UserModule,
    RefreshTokenModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

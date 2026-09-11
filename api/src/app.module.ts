import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './common/config/db.config';
import { validateEnv } from './common/config/env.validation';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommonModule } from './auth/common/common.module';
import { UserModule } from './user/user.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './common/config/logger.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { BullModule } from '@nestjs/bullmq';
import { bullConfig } from './common/config/bull.config';
import { envConfig } from './common/config/env.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(dbConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validate: validateEnv,
    }),
    LoggerModule.forRoot(loggerConfig),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync(dbConfig),
    CommonModule,
    UserModule,
    RefreshTokenModule,
    AuthModule,
    BullModule.forRootAsync(bullConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}

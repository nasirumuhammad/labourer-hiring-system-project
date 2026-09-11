import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from '@/common/config/env.config';
import { UserModule } from '@/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenModule } from '@/refresh-token/refresh-token.module';
import { AuthMapper } from './mappers/auth.mapper';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (jwt: ConfigType<typeof jwtConfig>) => ({
        secret: jwt.access.secret!,
        signOptions: { expiresIn: jwt.access.expiresIn as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy, AuthMapper],
})
export class AuthModule {}

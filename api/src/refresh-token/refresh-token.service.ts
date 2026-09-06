import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

interface CreateRefreshTokenInput {
  userId: string;
  token: string;
  jti: string;
}

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectPinoLogger(RefreshTokenService.name)
    private readonly logger: PinoLogger,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async create(input: CreateRefreshTokenInput): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create(input);
    const saved = await this.refreshTokenRepository.save(refreshToken);
    this.logger.debug(
      { userId: input.userId, jti: input.jti },
      'refresh token stored',
    );
    return saved;
  }

  async createWithManager(
    manager: EntityManager,
    input: CreateRefreshTokenInput,
  ): Promise<RefreshToken> {
    const refreshToken = manager.create(RefreshToken, input);
    const saved = await manager.save(refreshToken);
    this.logger.debug(
      { userId: input.userId, jti: input.jti },
      'refresh token stored (transactional)',
    );
    return saved;
  }

  async findByJti(jti: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOneBy({ jti });
  }

  async deleteByIdWithManager(
    manager: EntityManager,
    id: string,
  ): Promise<void> {
    await manager.delete(RefreshToken, { id });
    this.logger.debug(
      { refreshTokenId: id },
      'refresh token deleted (transactional)',
    );
  }

  async deleteAllUserTokens(userId: string): Promise<void> {
    const result = await this.refreshTokenRepository.delete({ userId });
    this.logger.debug(
      { userId, count: result.affected ?? 0 },
      'all refresh tokens deleted for user',
    );
  }
}

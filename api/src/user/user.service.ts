import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '@labour-hiring/enums';
import { User } from './entities/user.entity';
import { HashingService } from '@/auth/common/services/hashing.service';
import { maskEmail } from '@/auth/common/utils/mask.util';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async create(email: string, password: string, role: UserRole): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) {
      this.logger.warn(
        { email: maskEmail(email), role },
        'signup attempted with an email already in use',
      );
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await this.hashingService.hash(password);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    });
    const saved = await this.userRepository.save(user);

    this.logger.debug({ userId: saved.id, role }, 'user record created');

    return saved;
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashingService.hash(newPassword);
    await this.userRepository.increment({ email }, 'tokenVersion', 1);
    const result = await this.userRepository.update(
      { email },
      { password: hashedPassword },
    );

    if (!result.affected) {
      this.logger.warn(
        { email: maskEmail(email) },
        'password reset update affected zero rows: user may have been deleted mid-flow',
      );
    }
  }
}

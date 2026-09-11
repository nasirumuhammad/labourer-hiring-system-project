import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@labour-hiring/enums';
import { UserService } from '../user.service';
import { Logger } from '@nestjs/common';
import { maskEmail } from '@/auth/common/utils/mask.util';

@Injectable()
export class AdminSeeder {
  private readonly logger = new Logger(AdminSeeder.name);
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async run(): Promise<void> {
    const email = this.configService.getOrThrow<string>('ADMIN_EMAIL');
    const password = this.configService.getOrThrow<string>('ADMIN_PASSWORD');

    const existing = await this.userService.findByEmail(email);
    if (existing) {
      this.logger.log(
        { email: maskEmail(email) },
        'admin already seeded, skipping',
      );
      return;
    }

    await this.userService.create(email, password, UserRole.ADMIN);
    this.logger.log(
      { email: maskEmail(email) },
      'admin account seeded successfully',
    );
  }
}

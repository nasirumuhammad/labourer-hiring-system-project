import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AdminSeeder } from './seeders/admin.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, AdminSeeder],
  exports: [UserService],
})
export class UserModule {}

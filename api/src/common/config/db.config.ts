import { User } from '@/user/entities/user.entity';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { RefreshToken } from '@/refresh-token/entities/refresh-token.entity';
import { Job } from '@/job/entities/job.entity';
import { Application } from '@/application/entities/application.entity';
import { envConfig } from './env.config';
import { UserProfile } from '@/user-profile/entities/user-profile.entity';
import { AuditLog } from '@/admin/entities/audit-log.entity';
import { SavedJob } from '@/saved-job/entities/saved-job.entity';

export const dbConfig: TypeOrmModuleAsyncOptions = {
  inject: [envConfig.KEY],
  useFactory(env: ConfigType<NonNullable<typeof envConfig>>) {
    const {
      database: {dbUrl },
    } = env;
    return {
      type: 'postgres',
     url:dbUrl,
      entities: [
        User,
        RefreshToken,
        Job,
        Application,
        UserProfile,
        AuditLog,
        SavedJob,
      ],
      synchronize: true,
    };
  },
};

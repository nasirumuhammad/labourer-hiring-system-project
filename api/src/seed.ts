import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AdminSeeder } from './user/seeders/admin.seeder';
import { JobSeeder } from './job/seeders/job.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  try {
    const adminSeeder = app.get(AdminSeeder);
    const jobSeeder = app.get(JobSeeder);

    await adminSeeder.run();
    await jobSeeder.run();
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});

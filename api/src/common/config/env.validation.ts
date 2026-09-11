import z from 'zod';

const durationSchema = z
  .string()
  .regex(/^\d+[smhd]$/, 'must be a duration like "15m", "7d"');

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  JWT_EXPIRY: durationSchema,
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_REFRESH_EXPIRY: durationSchema,
  JWT_RESET_SECRET: z.string().min(1),
  JWT_RESET_EXPIRY: durationSchema,

  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(1),

  RESEND_API_KEY: z.string().nonempty(),
  RESEND_EMAIL: z.string().nonempty(),

  REDIS_PORT: z.string().nonempty(),
  REDIS_HOST: z.string().nonempty(),
});

export type EnvSchema = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvSchema {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(
      `Config validation failed:\n${result.error.issues
        .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
        .join('\n')}`,
    );
  }

  return result.data;
}

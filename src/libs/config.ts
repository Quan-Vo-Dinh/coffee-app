import z from 'zod';

export const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Server
  PORT: z.string().default('3000').transform(Number),
  APP_NAME: z.string().min(1, { message: 'APP_NAME is required' }),

  // Database
  DATABASE_URL: z.string().min(1, { message: 'DATABASE_URL is required' }),

  // JWT Tokens
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(4, { message: 'ACCESS_TOKEN_SECRET must be at least 32 characters' }),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(4, { message: 'REFRESH_TOKEN_SECRET must be at least 32 characters' }),
  ACCESS_TOKEN_EXPIRATION: z
    .string()
    .regex(/^\d+[smhd]$/, 'Invalid time format (e.g., 15m, 7d)'),
  REFRESH_TOKEN_EXPIRATION: z
    .string()
    .regex(/^\d+[smhd]$/, 'Invalid time format (e.g., 15m, 7d)'),

  // Security
  SECRET_API_KEY: z.string().min(1, { message: 'SECRET_API_KEY is required' }),
  SALT_ROUNDS: z.string().default('10').transform(Number),

  // Admin Account
  ADMIN_NAME: z.string().min(1, { message: 'ADMIN_NAME is required' }),
  ADMIN_EMAIL: z.string().email({ message: 'ADMIN_EMAIL must be valid email' }),
  ADMIN_PASSWORD: z
    .string()
    .min(8, { message: 'ADMIN_PASSWORD must be at least 8 characters' }),
  ADMIN_PHONE_NUMBER: z
    .string()
    .min(1, { message: 'ADMIN_PHONE_NUMBER is required' }),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      return `  - ${issue.path.join('.')}: ${issue.message}`;
    });

    throw new Error(
      `❌ Environment validation failed:\n${errors.join('\n')}\n\n` +
        `Please check your .env file and ensure all required variables are set.`,
    );
  }

  return result.data;
}

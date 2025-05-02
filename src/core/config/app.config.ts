import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const appEnvValidationSchema = z.object({
  host: z.string(),
  port: z.coerce.number().int(),
  database: z.string(),
  username: z.string(),
  password: z.string(),
});

export const appConfig = registerAs('app', () => {
  const dbConfig: z.infer<typeof appEnvValidationSchema> = {
    host: process.env.DATABASE_HOST!,
    port: +process.env.DATABASE_PORT!,
    database: process.env.DATABASE_NAME!,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
  };

  console.log(dbConfig);

  const parsed = appEnvValidationSchema.parse(dbConfig);
  return parsed;
});

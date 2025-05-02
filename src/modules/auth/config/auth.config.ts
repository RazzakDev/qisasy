import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const envAuthSchema = z.strictObject({
  atSecret: z.string(),
  atDuration: z.string(),
  rtSecret: z.string(),
  rtDuration: z.string(),
  hashingSecret: z.string(),
});

export const authConfig = registerAs('auth', () => {
  const authObject: z.infer<typeof envAuthSchema> = {
    atSecret: process.env.ACCESS_TOKEN_SECRET!,
    atDuration: process.env.ACCESS_TOKEN_DURATION!,
    rtSecret: process.env.REFRESH_TOKEN_SECRET!,
    rtDuration: process.env.REFRESH_TOKEN_DURATION!,
    hashingSecret: process.env.HASH_SECRET!,
  };

  const parsed = envAuthSchema.parse(authObject);

  return parsed;
});

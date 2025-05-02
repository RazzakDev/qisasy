import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const envHashSchema = z.strictObject({
  hashSecret: z.string(),
});

export const hashConfig = registerAs('hash', () => {
  const hashObject: z.infer<typeof envHashSchema> = {
    hashSecret: process.env.HASH_SECRET!,
  };

  const parsed = envHashSchema.parse(hashObject);

  return parsed;
});

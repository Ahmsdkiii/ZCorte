import "server-only";

import { envSchema, type Env } from "@/config/env-schema";

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  return envSchema.parse({
    DATABASE_URL: source.DATABASE_URL,
    AUTH_SECRET: source.AUTH_SECRET,
    NEXT_PUBLIC_SITE_URL: source.NEXT_PUBLIC_SITE_URL,
    ORDER_NUMBER_PREFIX: source.ORDER_NUMBER_PREFIX,
    PAYMENT_MODE: source.PAYMENT_MODE,
    ASSISTANT_MODE: source.ASSISTANT_MODE,
    TELEGRAM_MODE: source.TELEGRAM_MODE,
    STORAGE_MODE: source.STORAGE_MODE,
  });
}

export const env = parseEnv(process.env);

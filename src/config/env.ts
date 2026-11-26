import "server-only";

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.url(),
  ORDER_NUMBER_PREFIX: z.string().min(1),
  PAYMENT_MODE: z.enum(["simulated", "sandbox"]),
  ASSISTANT_MODE: z.enum(["scripted", "ai"]),
  TELEGRAM_MODE: z.enum(["simulator", "bot"]),
  STORAGE_MODE: z.enum(["local", "cloudinary"]),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  ORDER_NUMBER_PREFIX: process.env.ORDER_NUMBER_PREFIX,
  PAYMENT_MODE: process.env.PAYMENT_MODE,
  ASSISTANT_MODE: process.env.ASSISTANT_MODE,
  TELEGRAM_MODE: process.env.TELEGRAM_MODE,
  STORAGE_MODE: process.env.STORAGE_MODE,
});

export type Env = typeof env;

import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.url(),
  ORDER_NUMBER_PREFIX: z.string().min(1),
  PAYMENT_MODE: z.enum(["simulated", "sandbox"]),
  ASSISTANT_MODE: z.enum(["scripted", "ai"]),
  TELEGRAM_MODE: z.enum(["simulator", "bot"]),
  STORAGE_MODE: z.enum(["local", "cloudinary"]),
});

export type Env = z.infer<typeof envSchema>;

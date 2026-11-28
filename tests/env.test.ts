import { describe, expect, it } from "vitest";

import { envSchema } from "@/config/env-schema";

const validEnv = {
  DATABASE_URL: "postgresql://localhost:5432/zcorte",
  AUTH_SECRET: "a".repeat(32),
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  ORDER_NUMBER_PREFIX: "ZCT",
  PAYMENT_MODE: "simulated" as const,
  ASSISTANT_MODE: "scripted" as const,
  TELEGRAM_MODE: "simulator" as const,
  STORAGE_MODE: "local" as const,
};

describe("environment contract", () => {
  it("parses valid required environment variables", () => {
    expect(envSchema.parse(validEnv)).toEqual(validEnv);
  });

  it("rejects an invalid adapter mode", () => {
    expect(() => envSchema.parse({ ...validEnv, PAYMENT_MODE: "live" })).toThrow();
  });

  it("rejects a short Auth.js secret", () => {
    expect(() => envSchema.parse({ ...validEnv, AUTH_SECRET: "too-short" })).toThrow();
  });
});

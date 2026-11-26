import "server-only";

import { headers } from "next/headers";

import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { buildRateLimitKey } from "@/server/lib/rate-limit-key";

export const LOGIN_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 } as const;
export const REGISTER_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 } as const;

export async function enforceAuthRateLimit(
  scope: "login" | "register",
  email: string
): Promise<void> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || requestHeaders.get("x-real-ip")?.trim() || "unknown";
  const policy = scope === "login" ? LOGIN_RATE_LIMIT : REGISTER_RATE_LIMIT;
  const key = buildRateLimitKey(scope, email, ip);

  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "rate_limit_buckets" ("key", "windowStart", "count", "updatedAt")
    VALUES (${key}, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP)
    ON CONFLICT ("key") DO UPDATE SET
      "windowStart" = CASE
        WHEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - "rate_limit_buckets"."windowStart")) * 1000 >= ${policy.windowMs}
        THEN CURRENT_TIMESTAMP
        ELSE "rate_limit_buckets"."windowStart"
      END,
      "count" = CASE
        WHEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - "rate_limit_buckets"."windowStart")) * 1000 >= ${policy.windowMs}
        THEN 1
        ELSE "rate_limit_buckets"."count" + 1
      END,
      "updatedAt" = CURRENT_TIMESTAMP
    RETURNING "count"
  `;

  const count = rows[0]?.count;
  if (typeof count !== "number") {
    throw new AppError("INTERNAL_ERROR", "Unable to verify request limits.");
  }

  if (count > policy.limit) {
    throw new AppError("RATE_LIMITED", "Too many attempts. Please try again later.");
  }
}

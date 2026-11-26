import { createHash } from "node:crypto";

export function buildRateLimitKey(scope: "login" | "register", email: string, ip: string): string {
  const digest = createHash("sha256")
    .update(`${scope}:${email.trim().toLowerCase()}:${ip}`)
    .digest("hex");
  return `auth:${scope}:${digest}`;
}

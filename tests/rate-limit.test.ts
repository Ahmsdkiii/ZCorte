import { describe, expect, it } from "vitest";

import { buildRateLimitKey } from "@/server/lib/rate-limit-key";

describe("buildRateLimitKey", () => {
  it("normalizes email before hashing", () => {
    expect(buildRateLimitKey("login", " User@Example.com ", "127.0.0.1")).toBe(
      buildRateLimitKey("login", "user@example.com", "127.0.0.1")
    );
  });

  it("does not expose email or IP in the key", () => {
    const key = buildRateLimitKey("register", "user@example.com", "127.0.0.1");

    expect(key).not.toContain("user@example.com");
    expect(key).not.toContain("127.0.0.1");
    expect(key).toMatch(/^auth:register:[a-f0-9]{64}$/);
  });

  it("isolates scopes and identifiers", () => {
    const loginKey = buildRateLimitKey("login", "user@example.com", "127.0.0.1");
    const registerKey = buildRateLimitKey("register", "user@example.com", "127.0.0.1");
    const otherIpKey = buildRateLimitKey("login", "user@example.com", "127.0.0.2");

    expect(loginKey).not.toBe(registerKey);
    expect(loginKey).not.toBe(otherIpKey);
  });
});

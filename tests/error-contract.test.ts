import { describe, expect, it } from "vitest";

import { AppError, toActionResult } from "@/server/lib/errors";

describe("error contract", () => {
  it("maps AppError to a safe ActionResult", () => {
    const result = toActionResult(
      new AppError("VALIDATION_ERROR", "Invalid input.", {
        fieldErrors: { email: ["Email is required."] },
      })
    );

    expect(result).toEqual({
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Invalid input.",
      fieldErrors: { email: ["Email is required."] },
    });
  });

  it("hides unexpected error details", () => {
    const result = toActionResult(new Error("database password leaked"));

    expect(result).toEqual({
      ok: false,
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
    });
  });

  it("assigns HTTP status to domain errors", () => {
    expect(new AppError("RATE_LIMITED", "Try again later.").status).toBe(429);
  });
});

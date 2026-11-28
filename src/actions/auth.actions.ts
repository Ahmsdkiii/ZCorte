"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { Role } from "@prisma/client";
import type { ActionResult } from "@/lib/action-result";
import { signIn, signOut, auth } from "@/auth";
import { prisma } from "@/server/db/prisma";
import { isAppError } from "@/server/lib/errors";
import {
  assertAuthRateLimit,
  recordAuthFailure,
  resetAuthRateLimit,
} from "@/server/lib/rate-limit";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

const PHONE_REGEX = /^(\+62|62|0)8[0-9]{8,12}$/;

export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<ActionResult<AuthUser>> {
  const email = formData.email.trim().toLowerCase();
  const password = formData.password;

  if (!email || !email.includes("@")) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Please enter a valid email address.",
      fieldErrors: { email: ["Valid email is required."] },
    };
  }

  if (!password) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Password is required.",
      fieldErrors: { password: ["Password is required."] },
    };
  }

  try {
    await assertAuthRateLimit("login", email);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, passwordHash: true },
    });

    if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      await recordAuthFailure("login", email);
      return {
        ok: false,
        code: "UNAUTHENTICATED",
        message: "Invalid email or password.",
      };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    await resetAuthRateLimit("login", email);

    return {
      ok: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name ?? "ZCorté Member",
        role: user.role,
      },
    };
  } catch (error) {
    if (isAppError(error)) {
      return {
        ok: false,
        code: error.code,
        message: error.message,
        ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
      };
    }

    if (error instanceof AuthError) {
      return {
        ok: false,
        code: "UNAUTHENTICATED",
        message: "Invalid email or password.",
      };
    }

    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: "Authentication error occurred.",
    };
  }
}

export async function registerAction(formData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
}): Promise<ActionResult<AuthUser>> {
  const name = formData.name.trim();
  const email = formData.email.trim().toLowerCase();
  const phone = formData.phone.trim().replace(/[\s-]/g, "");
  const password = formData.password;

  const fieldErrors: Record<string, string> = {};

  if (!name) {
    fieldErrors.name = "Full name is required.";
  }

  if (!email || !email.includes("@")) {
    fieldErrors.email = "Valid email is required.";
  }

  if (!phone) {
    fieldErrors.phone = "Phone number is required.";
  } else if (!PHONE_REGEX.test(phone)) {
    fieldErrors.phone =
      "Enter a valid Indonesian mobile number (e.g. +628123456789 or 08123456789).";
  }

  if (!password || password.length < 10) {
    fieldErrors.password = "Password must be at least 10 characters long.";
  }

  if (formData.confirmPassword !== undefined && password !== formData.confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Please correct the highlighted form errors.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, message]) => [key, [message]])
      ),
    };
  }

  try {
    await assertAuthRateLimit("register", email);

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      await recordAuthFailure("register", email);
      return {
        ok: false,
        code: "CONFLICT",
        message: "An account with this email address already exists.",
        fieldErrors: { email: ["Email is already registered."] },
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: Role.CUSTOMER,
      },
    });

    await signIn("credentials", {
      email: newUser.email,
      password,
      redirect: false,
    });

    return {
      ok: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name ?? name,
        role: newUser.role,
      },
    };
  } catch (error) {
    if (isAppError(error)) {
      return {
        ok: false,
        code: error.code,
        message: error.message,
        ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
      };
    }

    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: "Registration error occurred.",
    };
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
}

export async function getCurrentUserAction() {
  return auth();
}

"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { Role } from "@prisma/client";
import { signIn, signOut, auth } from "@/auth";
import { prisma } from "@/server/db/prisma";
import { isAppError } from "@/server/lib/errors";
import { enforceAuthRateLimit } from "@/server/lib/rate-limit";

export interface AuthActionResult {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
}

const PHONE_REGEX = /^(\+62|62|0)8[0-9]{8,12}$/;

export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  const email = formData.email.trim().toLowerCase();
  const password = formData.password;

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      fieldErrors: { email: "Valid email is required." },
    };
  }

  if (!password) {
    return {
      success: false,
      message: "Password is required.",
      fieldErrors: { password: "Password is required." },
    };
  }

  try {
    await enforceAuthRateLimit("login", email);
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const session = await auth();
    if (!session?.user?.id || !session.user.email || !session.user.role) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    return {
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? "ZCorté Member",
        role: session.user.role,
      },
    };
  } catch (error) {
    if (isAppError(error)) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    return {
      success: false,
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
}): Promise<AuthActionResult> {
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
      success: false,
      message: "Please correct the highlighted form errors.",
      fieldErrors,
    };
  }

  try {
    await enforceAuthRateLimit("register", email);

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return {
        success: false,
        message: "An account with this email address already exists.",
        fieldErrors: { email: "Email is already registered." },
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

    const session = await auth();
    if (!session?.user?.id || !session.user.email || !session.user.role) {
      return {
        success: false,
        message: "Registration completed, but sign in failed.",
      };
    }

    return {
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? name,
        role: session.user.role,
      },
    };
  } catch (error) {
    if (isAppError(error)) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
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

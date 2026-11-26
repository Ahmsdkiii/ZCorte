import { Role } from "@prisma/client";

import { auth } from "@/auth";
import { AppError } from "@/server/lib/errors";

export interface AuthContext {
  userId: string;
  email: string;
  name: string | null;
  role: Role;
}

export async function requireUser(): Promise<AuthContext> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id || !user.email || !isRole(user.role)) {
    throw new AppError("UNAUTHENTICATED", "Authentication required.");
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role,
  };
}

export async function requireRole(requiredRole: Role): Promise<AuthContext> {
  const context = await requireUser();

  if (context.role !== requiredRole) {
    throw new AppError("FORBIDDEN", "You do not have permission to perform this action.");
  }

  return context;
}

function isRole(value: unknown): value is Role {
  return value === Role.CUSTOMER || value === Role.OWNER;
}

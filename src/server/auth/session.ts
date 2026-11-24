import { cookies } from "next/headers";
import { Role } from "@prisma/client";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

const SESSION_COOKIE_NAME = "zcorte_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSession(user: SessionUser) {
  const cookieStore = await cookies();
  const payload = JSON.stringify(user);
  const encoded = Buffer.from(payload).toString("base64");

  cookieStore.set(SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded) as SessionUser;
    if (parsed.id && parsed.email && parsed.role) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/server/db/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.id === "string" && isRole(token.role)) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export const authRoles = [Role.CUSTOMER, Role.OWNER] as const;

function isRole(value: unknown): value is Role {
  return value === Role.CUSTOMER || value === Role.OWNER;
}

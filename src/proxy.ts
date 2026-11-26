import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((request) => {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  const session = request.auth;

  if (!session?.user) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && session.user.role !== "OWNER") {
    return NextResponse.redirect(new URL("/account", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};

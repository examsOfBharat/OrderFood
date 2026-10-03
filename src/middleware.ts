import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  const isStoreAdminRoute = nextUrl.pathname.startsWith("/store-admin");
  const isSuperAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (userRole === "super_admin") return NextResponse.redirect(new URL("/admin", nextUrl));
      if (userRole === "store_owner") return NextResponse.redirect(new URL("/store-admin", nextUrl));
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && (isStoreAdminRoute || isSuperAdminRoute)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isStoreAdminRoute && userRole !== "store_owner" && userRole !== "super_admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isSuperAdminRoute && userRole !== "super_admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

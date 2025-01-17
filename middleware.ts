import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// 1. Specify protected routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Get session cookie
  const sessionCookie = req.cookies.get("session");

  // Check if user is authenticated
  const payload = sessionCookie && (await decrypt(sessionCookie.value));

  let isAuthenticated = false;
  if (payload?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    isAuthenticated = !!user;
  }

  // Add debug headers
  const response = isAuthenticated
    ? path === "/" || publicRoutes.includes(path)
      ? NextResponse.redirect(new URL("/dashboard", req.nextUrl))
      : NextResponse.next()
    : protectedRoutes.includes(path)
    ? NextResponse.redirect(new URL("/login", req.nextUrl))
    : NextResponse.next();

  // Add debug information to response headers
  response.headers.set("x-middleware-cache", "no-cache");
  response.headers.set("x-debug-path", path);
  response.headers.set("x-debug-authenticated", String(isAuthenticated));
  response.headers.set("x-debug-has-cookie", String(!!sessionCookie));

  return response;
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};

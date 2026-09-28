import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_TOKEN_COOKIE } from "./lib/cookie-config";
import { UserRole } from "@labour-hiring/enums";

/**
 * ASSUMPTIONS — adjust to match your setup:
 * 1. Access token is a JWT in a cookie named accessToken.
 * 2. The JWT payload carries `role` as a @repo/enums Role value.
 * 3. Route groups like (auth) don't appear in URLs, so every route below
 *    is the real folder name. Confirm they match your app/ folders.
 */

const accessToken = ACCESS_TOKEN_COOKIE;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const AUTH_ROUTES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/otp",
  "/reset-password",
];
const ADMIN_ROUTE = "/admin";
const DASHBOARD_ROUTE = "/dashboard";
const EMPLOYEE_ROUTE = "/employee";
const APPLICATIONS_ROUTE = "/dashboard/applications";
const SIGNIN_ROUTE = "/signin";

interface SessionPayload {
  sub: string;
  role: UserRole;
}

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function matchesAnyRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => matchesRoute(pathname, route));
}

async function readSession(
  request: NextRequest,
): Promise<SessionPayload | null> {
  const token = request.cookies.get(accessToken)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<SessionPayload>(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

function getRoleLandingRoute(role: UserRole): string {
  return role === UserRole.ADMIN ? ADMIN_ROUTE : DASHBOARD_ROUTE;
}

function redirectTo(request: NextRequest, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const session = await readSession(request);

  // Auth pages: open to signed-out visitors, closed to signed-in users.
  if (matchesAnyRoute(pathname, AUTH_ROUTES)) {
    return session
      ? redirectTo(request, getRoleLandingRoute(session.role))
      : NextResponse.next();
  }

  if (!session) {
    return redirectTo(request, SIGNIN_ROUTE);
  }

  // Admins only in /admin, and admins can't go anywhere else.
  if (matchesRoute(pathname, ADMIN_ROUTE)) {
    return session.role === UserRole.ADMIN
      ? NextResponse.next()
      : redirectTo(request, DASHBOARD_ROUTE);
  }
  if (session.role === UserRole.ADMIN) {
    return redirectTo(request, ADMIN_ROUTE);
  }

  if (
    matchesRoute(pathname, EMPLOYEE_ROUTE) &&
    session.role !== UserRole.EMPLOYER
  ) {
    return redirectTo(request, DASHBOARD_ROUTE);
  }

  if (
    matchesRoute(pathname, APPLICATIONS_ROUTE) &&
    session.role !== UserRole.LABOURER
  ) {
    return redirectTo(request, DASHBOARD_ROUTE);
  }

  return NextResponse.next();
}

// Must be a static literal (Next.js can't read constants here). Keep in sync with the route constants above.
export const config = {
  matcher: [
    "/signin/:path*",
    "/signup/:path*",
    "/forgot-password/:path*",
    "/otp/:path*",
    "/reset-password/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/employee/:path*",
  ],
};

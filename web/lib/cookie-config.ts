import { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

const isProd = process.env.NODE_ENV === "production";

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes  matches JWT_EXPIRY
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days  matches JWT_REFRESH_EXPIRY

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict" as const,
  path: "/",
  maxAge: ACCESS_TOKEN_MAX_AGE,
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict" as const,
  path: "/",
  maxAge: REFRESH_TOKEN_MAX_AGE,
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export function setAuthCookies(
  response: NextResponse,
  tokens: TokenPair,
): void {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    accessTokenCookieOptions,
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    refreshTokenCookieOptions,
  );
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    ...accessTokenCookieOptions,
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    ...refreshTokenCookieOptions,
    maxAge: 0,
  });
}

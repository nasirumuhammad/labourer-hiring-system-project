import {
  ACCESS_TOKEN_COOKIE,
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
} from "@/lib/cookie-config";
import { refreshTokens } from "@/lib/refresh-session";
import { verifyAccessToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  let payload = accessToken ? await verifyAccessToken(accessToken) : null;
  let refreshedTokens = null;

  if (!payload && refreshToken) {
    refreshedTokens = await refreshTokens(refreshToken);
    if (refreshedTokens) {
      payload = await verifyAccessToken(refreshedTokens.accessToken);
    }
  }

  if (!payload) {
    const response = NextResponse.json(
      {
        message: "Authentication fail",
      },
      { status: 401 },
    );

    if (!accessToken || refreshToken) clearAuthCookies(response);
    return response;
  }
  const { aud, iat, nbf, iss, ...requiredPayload } = payload;
  const response = NextResponse.json(requiredPayload);
  if (refreshedTokens) setAuthCookies(response, refreshedTokens);
  return response;
}

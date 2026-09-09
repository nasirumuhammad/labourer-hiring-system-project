import { clearAuthCookies, REFRESH_TOKEN_COOKIE } from "@/lib/cookie-config";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_URL;

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await fetch(`${BASE_URL}/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      cache: "no-store",
    }).catch((error) => {
      console.warn("Failed to invalidate token on NestJS:", error);
    });
  }

  const response = NextResponse.json(
    {
      message: "Signed out successfully",
      success: true,
    },
    { status: 200 },
  );

  clearAuthCookies(response);

  return response;
}

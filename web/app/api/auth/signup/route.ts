import { setAuthCookies } from "@/lib/cookie-config";
import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api-url";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${getApiBaseUrl()}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.data) {
    return NextResponse.json(result || { message: "Signup failed" }, {
      status: response.status,
    });
  }

  const tokens = result.data;

  const nextResponse = NextResponse.json({
    message: result.message || "Signup successful",
  });

  setAuthCookies(nextResponse, tokens);

  return nextResponse;
}

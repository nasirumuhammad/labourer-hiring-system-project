import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_URL;

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.data) {
    return NextResponse.json(
      result || { message: "Verification failed" },
      { status: response.status },
    );
  }

  return NextResponse.json({
    message: result.message || "Code verified",
    data: result.data,
  });
}

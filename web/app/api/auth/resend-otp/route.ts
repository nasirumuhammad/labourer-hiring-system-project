import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_URL;

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  return NextResponse.json(
    result || { message: "Something went wrong. Please try again." },
    { status: response.status },
  );
}

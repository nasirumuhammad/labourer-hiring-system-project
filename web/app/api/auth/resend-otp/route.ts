import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api-url";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${getApiBaseUrl()}/auth/resend-otp`, {
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

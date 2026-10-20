import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api-url";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${getApiBaseUrl()}/auth/verify-otp`, {
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

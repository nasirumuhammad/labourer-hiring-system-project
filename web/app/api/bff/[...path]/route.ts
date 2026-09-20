import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
} from "@/lib/cookie-config";
import { refreshTokens } from "@/lib/refresh-session";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_URL?.replace(/\/$/, "");

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

async function createProxyResponse(response: Response): Promise<NextResponse> {
  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: response.headers,
  });
}

async function bffRequest(
  request: NextRequest,
  pathSegment: string[],
): Promise<NextResponse> {
  const endpoint = pathSegment.join("/");
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;

  const makeRequest = (token: string | null) => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const body = ["GET", "HEAD"].includes(request.method)
      ? undefined
      : request.body;

    const queryString = new URL(request.url).search;

    return fetch(`${BASE_URL}/${endpoint}${queryString}`, {
      headers,
      body,
      cache: "no-store",
      method: request.method,
      ...(body ? { duplex: "half" as const } : {}),
    });
  };

  let response = await makeRequest(accessToken);

  if (response.status === 401) {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    const tokens = refreshToken ? await refreshTokens(refreshToken) : null;

    if (tokens) {
      response = await makeRequest(tokens.accessToken);

      const nextResponse = await createProxyResponse(response);

      setAuthCookies(nextResponse, tokens);

      return nextResponse;
    }
  }

  return createProxyResponse(response);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;

  return bffRequest(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;

  return bffRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;

  return bffRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;

  return bffRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;

  return bffRequest(request, path);
}

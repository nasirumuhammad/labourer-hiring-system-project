import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
} from "@/lib/cookie-config";
import { refreshTokens } from "@/lib/refresh-session";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_URL;

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
  const accessToken = request.headers.get(ACCESS_TOKEN_COOKIE);

  const makeRequest = (token: string | null) => {
    const headers = new Headers();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const body = ["GET", "HEAD"].includes(request.method)
      ? undefined
      : request.body;

    const queryString = new URL(request.url).search;
    return fetch(`${BASE_URL}${endpoint}${queryString}`, {
      headers,
      body,
      cache: "no-store",
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

type RequestHandlerParam = {
  request: NextRequest;
  params: { params: Promise<{ path: string[] }> };
};

export async function GET({
  params: { params },
  request,
}: RequestHandlerParam) {
  const { path } = await params;
  return bffRequest(request, path);
}

export async function POST({
  params: { params },
  request,
}: RequestHandlerParam) {
  const { path } = await params;
  return bffRequest(request, path);
}

export async function DELETE({
  params: { params },
  request,
}: RequestHandlerParam) {
  const { path } = await params;
  return bffRequest(request, path);
}

export async function PUT({
  params: { params },
  request,
}: RequestHandlerParam) {
  const { path } = await params;
  return bffRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return bffRequest(request, path);
}

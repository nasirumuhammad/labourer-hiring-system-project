import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import { ApiError } from "./api-error";

const BFF_AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_BFF_AUTH_BASE_URL ?? "/api/auth";
const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_BASE_URL ?? "/api/bff";

interface RequestContext {
  origin: string;
  cookieHeader?: string;
}

async function resolveRequestContext(): Promise<RequestContext> {
  if (typeof window !== "undefined") {
    // Client-side: relative URLs resolve against the current page, and
    // the browser attaches cookies automatically — nothing to do.
    return { origin: "" };
  }

  // Server Components/Actions run in Node, where fetch has no "current
  // page" to resolve a relative URL against, and a server-side self-call
  // does NOT automatically carry the browser's cookies the way a real
  // browser request does — both have to be supplied explicitly.
  // Dynamic import: next/headers is server-only and must never be
  // statically imported here, since this module is also bundled into
  // client components.
  const { headers } = await import("next/headers");
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  return {
    origin: `${protocol}://${host}`,
    cookieHeader: headerList.get("cookie") ?? undefined,
  };
}

function buildHeaders(
  cookieHeader: string | undefined,
  hasBody: boolean,
): HeadersInit {
  const headers: Record<string, string> = {};
  if (cookieHeader) headers.Cookie = cookieHeader;
  if (hasBody) headers["Content-Type"] = "application/json";
  return headers;
}

type ParseResponse<T> = Promise<ApiSuccessResponse<T> | undefined>;

async function parseResponse<T>(
  response: Response,
): Promise<ApiSuccessResponse<T> | undefined> {
  const json = (await response.json().catch(() => null)) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse
    | null;

  if (!response.ok) {
    const errorBody = json as ApiErrorResponse | null;
    throw new ApiError(
      errorBody?.message ?? "Something went wrong. Please try again.",
      errorBody?.errors,
    );
  }

  return json as ApiSuccessResponse<T>;
}

async function request<T>(
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT",
  body?: unknown,
): Promise<ParseResponse<T>> {
  const { origin, cookieHeader } = await resolveRequestContext();
  const hasBody = typeof body !== "undefined";
  const response = await fetch(`${origin}${BFF_BASE_URL}${path}`, {
    body: hasBody ? JSON.stringify(body) : undefined,
    headers: buildHeaders(cookieHeader, hasBody),
    method,
  });
  return parseResponse<T>(response);
}

export async function authRequest<T>(
  path: string,
  body?: unknown,
  method: "GET" | "POST" = "POST",
): Promise<ApiSuccessResponse<T> | undefined> {
  const { origin, cookieHeader } = await resolveRequestContext();
  const hasBody = typeof body !== "undefined";
  const response = await fetch(`${origin}${BFF_AUTH_BASE_URL}${path}`, {
    body: hasBody ? JSON.stringify(body) : undefined,
    headers: buildHeaders(cookieHeader, hasBody),
    method,
    cache: "no-store",
  });
  return parseResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body: unknown) => request<T>(path, "POST", body),
  delete: <T>(path: string, body: unknown) => request<T>(path, "DELETE", body),
  update: <T>(path: string, body: unknown) => request<T>(path, "PATCH", body),
};

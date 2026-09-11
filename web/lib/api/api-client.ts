import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import { ApiError } from "./api-error";

const BFF_AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_BFF_AUTH_BASE_URL ?? "/api/auth";
const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_BASE_URL ?? "/api/bff";

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
  const response = await fetch(`${BFF_BASE_URL}${path}`, {
    body: typeof body !== "undefined" ? JSON.stringify(body) : undefined,
    method,
  });
  return parseResponse<T>(response);
}

export async function authRequest<T>(
  path: string,
  body?: unknown,
  method: "GET" | "POST" = "POST",
): Promise<ApiSuccessResponse<T> | undefined> {
  const response = await fetch(`${BFF_AUTH_BASE_URL}${path}`, {
    body: typeof body !== "undefined" ? JSON.stringify(body) : undefined,
    method,
    cache: "no-store",
  });
  return parseResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body: unknown) => request<T>(path, "POST", body),
  delete: <T>(path: string, body: unknown) => request<T>(path, "DELETE", body),
  update: <T>(path: string, body: unknown) => <T>request(path, "PATCH", body),
};

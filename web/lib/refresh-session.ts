import { TokenPair } from "./cookie-config";

const BASE_URL = process.env.API_URL;

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

type ApiResponse<T> = {
  message?: string;
  data?: T;
  error: Record<string, string[]>;
};

export async function refreshTokens(
  refreshToken: string,
): Promise<TokenPair | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response
      .json()
      .catch(() => null)) as ApiResponse<TokenPair | null>;

    const data = json.data;
    if (
      !data ||
      typeof data?.accessToken != "string" ||
      typeof data?.refreshToken != "string"
    )
      return null;
    return data;
  } catch (error) {
    return null;
  }
}

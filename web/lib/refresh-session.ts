import { TokenPair } from "./cookie-config";
import { getApiBaseUrl } from "./api-url";

type ApiResponse<T> = {
  message?: string;
  data?: T;
  error: Record<string, string[]>;
};

export async function refreshTokens(
  refreshToken: string,
): Promise<TokenPair | null> {
  // Outside the try block: a missing API_URL must fail loudly, not read as
  // "session expired".
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
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

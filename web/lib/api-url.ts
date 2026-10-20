const API_URL_MISSING_MESSAGE = "API_URL is not defined";
const TRAILING_SLASH_PATTERN = /\/$/;

/**
 * Resolves the upstream API base URL lazily so importing a route module never
 * requires API_URL (it may be absent during `next build`). Throws at first use
 * if the runtime environment is misconfigured.
 */
export function getApiBaseUrl(): string {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) throw new Error(API_URL_MISSING_MESSAGE);

  return baseUrl.replace(TRAILING_SLASH_PATTERN, "");
}

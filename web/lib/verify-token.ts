import { Payload } from "@labour-hiring/types";
import { jwtVerify, type JWTPayload } from "jose";

export type AuthPayload = JWTPayload & Payload;

const JWT_SECRET_MISSING_MESSAGE = "JWT_SECRET is not defined";

let cachedSecretKey: Uint8Array | null = null;

/**
 * Resolves the signing key lazily so importing this module never requires
 * JWT_SECRET (it is absent during `next build`). Throws at first use if the
 * runtime environment is misconfigured.
 */
export function getJwtSecretKey(): Uint8Array {
  if (cachedSecretKey) return cachedSecretKey;

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error(JWT_SECRET_MISSING_MESSAGE);

  cachedSecretKey = new TextEncoder().encode(secret);
  return cachedSecretKey;
}

/**
 * Verifies an access token's signature and shape. Runs on the edge
 * runtime (used by proxy.ts) as well as Node route handlers, so this
 * stays dependency-light — jose only, no Node-specific APIs.
 *
 * Returns null on any invalid/expired/malformed token rather than
 * throwing, so callers can treat "not authenticated" uniformly.
 */

export async function verifyAccessToken(
  token: string,
): Promise<AuthPayload | null> {
  // Outside the try block: a missing secret must fail loudly, not read as
  // "unauthenticated".
  const secretKey = getJwtSecretKey();

  try {
    const { payload } = await jwtVerify<AuthPayload>(token, secretKey);

    if (
      typeof payload.sub !== "string" ||
      typeof payload.jti !== "string" ||
      typeof payload.tokenVersion !== "number" ||
      !payload.role
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

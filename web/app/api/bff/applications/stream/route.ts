import { ACCESS_TOKEN_COOKIE } from "@/lib/cookie-config";
import { NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/api-url";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const upstream = await fetch(`${getApiBaseUrl()}/applications/stream`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "text/event-stream",
    },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Failed to connect to event stream", {
      status: upstream.status || 502,
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

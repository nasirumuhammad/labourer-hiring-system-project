"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * Client-side backstop: sends signed-in users of the wrong role back to
 * their dashboard. The proxy and the API enforce access; this just keeps
 * the UI from lingering on a page the person can't use.
 */
export function RequireRole({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user && user.role !== role) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, role, router]);

  return <>{children}</>;
}

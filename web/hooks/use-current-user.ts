import { useEffect, useState } from "react";
import { authApi, type MeResponse } from "@/lib/api/auth";

export function useCurrentUser() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    authApi
      .me()
      .then((response) => {
        if (active) setUser(response ?? null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { user, isLoading };
}

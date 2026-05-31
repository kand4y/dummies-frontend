import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";
import { useCallback } from "react";

export function useApi() {
  const { session } = useAuth();

  const api = useCallback(
    <T>(path: string, options?: RequestInit) => {
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");
      return apiFetch<T>(path, token, options);
    },
    [session],
  );

  return api;
}

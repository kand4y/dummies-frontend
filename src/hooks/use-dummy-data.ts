import { useState, useEffect, useCallback } from "react";
import { useApi } from "./use-api";
import type { DummyData } from "@/types";

export function useDummyDataList(projectId: string) {
  const api = useApi();
  const [data, setData] = useState<DummyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api<DummyData[]>(
        `/api/v1/projects/${projectId}/dummies`,
      );
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [api, projectId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useDummyData(uuid: string) {
  const api = useApi();
  const [data, setData] = useState<DummyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api<DummyData>(`/api/v1/dummies/${uuid}`)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, uuid]);

  return { data, loading, error };
}

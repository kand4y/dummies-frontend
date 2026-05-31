import { useState, useEffect, useCallback } from "react";
import { useApi } from "./use-api";
import type { Project, ProjectListResponse } from "@/types";

export function useProjects(page: number) {
  const api = useApi();
  const [data, setData] = useState<ProjectListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api<ProjectListResponse>(
        `/api/v1/projects?page=${page}`,
      );
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [api, page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useProject(id: string) {
  const api = useApi();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api<Project>(`/api/v1/projects/${id}`)
      .then((p) => {
        if (!cancelled) setProject(p);
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
  }, [api, id]);

  return { project, loading, error };
}

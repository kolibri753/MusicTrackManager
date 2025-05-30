import { useState, useEffect, useCallback } from "react";
import { artistService } from "@/api";
import type { RefreshableResourceState } from "@/types/resource";

/**
 * Get the list of artist names
 */
export function useArtists(): RefreshableResourceState<string> {
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(false);
      const data = await artistService.list({ signal });
      setList(data);
    } catch (err: unknown) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  const refetch = () => load();

  return { list, loading, error, refetch };
}

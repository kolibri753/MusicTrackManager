import { useState, useEffect, useCallback } from "react";
import { artistService } from "@/api";

/**
 * Get the list of artist names
 */
export function useArtists() {
  const [artists, setArtists] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const data = await artistService.list({ signal });
      setArtists(data);
      setError(null);
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") setError(err as Error);
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

  return { artists, loading, error, refetch };
}

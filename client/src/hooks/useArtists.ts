import { useState, useEffect, useCallback } from "react";
import { artistService } from "@/api";
import type { RefreshableResourceState } from "@/types";
import type { AppError } from "@/api/errors";

/**
 * Get the list of artist names
 */
export function useArtists(): RefreshableResourceState<string> {
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);

    const res = await artistService.list({ signal });
    res.match(
      (data) => {
        setList(data);
        setError(null);
      },
      (e) => setError(e)
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    void load(ctrl.signal);
    return () => {
      ctrl.abort();
    };
  }, [load]);

  const refetch = () => {
    void load();
  };

  return { list, loading, error, refetch };
}

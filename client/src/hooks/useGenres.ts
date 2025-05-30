import { useEffect, useState } from "react";
import { genreService } from "@/api";
import type { ResourceState } from "@/types";
import type { AppError } from "@/api/errors";

/**
 * Get the list of genre names
 */
export function useGenres(): ResourceState<string> {
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);

    genreService
      .list({ signal: ctrl.signal })
      .then((res) =>
        res.match(
          (data) => {
            setList(data);
            setError(null);
          },
          (e) => {
            setError(e);
          }
        )
      )
      .finally(() => {
        setLoading(false);
      });

    return () => ctrl.abort();
  }, []);

  return { list, loading, error };
}

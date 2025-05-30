import { useEffect, useState } from "react";
import { genreService } from "@/api";
import type { ResourceState } from "@/types";

/**
 * Get the list of genre names
 */
export function useGenres(): ResourceState<string> {
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();

    genreService
      .list({ signal: ctrl.signal })
      .then((data) => {
        setList(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError(true);
          setLoading(false);
        }
      });

    return () => ctrl.abort();
  }, []);

  return { list, loading, error };
}

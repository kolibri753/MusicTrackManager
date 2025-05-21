import { useEffect, useState } from "react";
import { genreService } from "@/api";

/**
 * Get the list of genre names
 */
export function useGenres() {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    genreService
      .list({ signal: ctrl.signal })
      .then((data) => {
        setGenres(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err);
          setLoading(false);
        }
      });

    return () => ctrl.abort();
  }, []);

  return { genres, loading, error };
}

import { useEffect, useState } from 'react';
import { artistService } from '@/api';

/**
 * Get the list of artist names
 */
export function useArtists() {
  const [artists, setArtists] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    artistService
      .list({ signal: ctrl.signal })
      .then((data) => {
        setArtists(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      });

    return () => ctrl.abort();
  }, []);

  return { artists, loading, error };
}

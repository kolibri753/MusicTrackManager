import { useState, useEffect, useCallback } from "react";
import { trackService } from "@/api";
import type { Track, Meta } from "@/types";

/**
 * Fetch and control paged track data with local mutators
 */
export function useTracks(initialLimit = 10) {
  const [data, setData] = useState<Track[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [sort, setSort] = useState<keyof Track>("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [genre, setGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await trackService.fetchTracks(
          { page, limit, sort, order, genre, artist, search },
          signal
        );
        setData(res.data);
        setMeta(res.meta);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, sort, order, genre, artist, search]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchData]);

  const addTrack = (track: Track) => {
    setData((prev) => [track, ...prev]);
    setMeta((prev) => ({ ...prev, total: prev.total + 1 }));
  };

  const updateTrack = (track: Track) =>
    setData((prev) => prev.map((t) => (t.id === track.id ? track : t)));

  const removeTrack = (id: string) => {
    setData((prev) => prev.filter((t) => t.id !== id));
    setMeta((prev) => ({ ...prev, total: Math.max(prev.total - 1, 0) }));
  };

  const removeMany = (ids: string[]) => {
    setData((prev) => prev.filter((t) => !ids.includes(t.id)));
    setMeta((prev) => ({
      ...prev,
      total: Math.max(prev.total - ids.length, 0),
    }));
  };

  return {
    /* data */
    data,
    meta,
    loading,
    error,
    /* query params */
    page,
    limit,
    sort,
    order,
    genre,
    artist,
    search,
    /* setters */
    setPage,
    setLimit,
    setSort,
    setOrder,
    setGenre,
    setArtist,
    setSearch,
    /* actions */
    refetch: () => fetchData(),
    addTrack,
    updateTrack,
    removeTrack,
    removeMany,
  };
}

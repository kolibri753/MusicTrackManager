import { useState, useEffect, useCallback } from "react";
import { trackService } from "@/api";
import type { Track, Meta } from "@/types";
import type { AppError } from "@/api/errors";

/**
 * Fetch and control paged track data
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
  const [error, setError] = useState<AppError | null>(null);

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
      const res = await trackService.fetchTracks(
        { page, limit, sort, order, genre, artist, search },
        signal
      );

      res.match(
        ({ data: list, meta: m }) => {
          setData(list);
          setMeta(m);
          setError(null);
        },
        (e) => setError(e)
      );

      setLoading(false);
    },
    [page, limit, sort, order, genre, artist, search]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchData]);

  return {
    data,
    meta,
    loading,
    error,
    page,
    limit,
    sort,
    order,
    genre,
    artist,
    search,
    setPage,
    setLimit,
    setSort,
    setOrder,
    setGenre,
    setArtist,
    setSearch,
    refetch: () => fetchData(),
  };
}

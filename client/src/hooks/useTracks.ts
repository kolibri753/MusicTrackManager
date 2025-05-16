import { useState, useEffect, useCallback } from "react";
import { trackService } from "@/api";
import type { Track, Meta } from "@/types/track";

/**
 * Custom hook to paginate, sort, filter, and search tracks.
 */
export function useTracks(initialLimit = 10) {
  const [data, setData] = useState<Track[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 1,
  });

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [sort, setSort] = useState<keyof Track>("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [filterGenre, setFilterGenre] = useState<string>("");
  const [filterArtist, setFilterArtist] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  /**
   * Fetches the current page of tracks with applied filters & sorting.
   */
  const load = useCallback(async () => {
    try {
      const result = await trackService.fetchTracks(
        page,
        limit,
        sort,
        order,
        filterGenre,
        filterArtist,
        search
      );
      setData(result.data);
      setMeta(result.meta);
    } catch (err) {
      console.error("Failed to load tracks:", err);
    }
  }, [page, limit, sort, order, filterGenre, filterArtist, search]);

  // Reload whenever dependencies change
  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    meta,
    page,
    limit,
    sort,
    order,
    filterGenre,
    filterArtist,
    search,
    setPage,
    setLimit,
    setSort,
    setOrder,
    setFilterGenre,
    setFilterArtist,
    setSearch,
    refetch: load,
  };
}

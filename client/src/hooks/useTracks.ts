import { useState, useEffect, useCallback } from "react";
import { fetchTracks } from "@/api/tracks";
import type { Track, Meta } from "@/types/track";

export function useTracks(initialLimit = 10) {
  const [data, setData] = useState<Track[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [sort, setSort] = useState<keyof Track>("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const load = useCallback(async () => {
    const res = await fetchTracks(page, limit, sort, order);
    setData(res.data);
    setMeta(res.meta);
  }, [page, limit, sort, order]);

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
    setPage,
    setLimit,
    setSort,
    setOrder,
  };
}

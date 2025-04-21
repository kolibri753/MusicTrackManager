import { useState, useEffect, useReducer, useCallback } from "react";
import { fetchTracks, createTrack, Track, Meta } from "../api/tracks";
import { TrackDto } from "../types/trackDto";

// Types for sorting and ordering
export type SortField = "title" | "artist" | "album" | "createdAt";
export type Order = "asc" | "desc";

// Combined query state
interface QueryState {
  sort: SortField;
  order: Order;
  genre: string;
  artist: string;
  page: number;
  limit: number;
}

// Actions to update query
type QueryAction =
  | { type: "SET_SORT"; payload: SortField }
  | { type: "SET_ORDER"; payload: Order }
  | { type: "SET_GENRE"; payload: string }
  | { type: "SET_ARTIST"; payload: string }
  | { type: "SET_PAGE"; payload: number };

// Reducer to handle query changes
function queryReducer(state: QueryState, action: QueryAction): QueryState {
  switch (action.type) {
    case "SET_SORT":
      return { ...state, sort: action.payload, page: 1 };
    case "SET_ORDER":
      return { ...state, order: action.payload, page: 1 };
    case "SET_GENRE":
      return { ...state, genre: action.payload, page: 1 };
    case "SET_ARTIST":
      return { ...state, artist: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

// Custom hook
export const useTracks = (initialLimit = 10) => {
  const [query, dispatch] = useReducer(queryReducer, {
    sort: "createdAt",
    order: "desc",
    genre: "",
    artist: "",
    page: 1,
    limit: initialLimit,
  });

  const [tracks, setTracks] = useState<Track[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 1,
  });

  // Fetch data whenever query changes
  const load = useCallback(async () => {
    const res = await fetchTracks(
      query.page,
      query.limit,
      query.sort,
      query.order,
      query.genre || undefined,
      query.artist || undefined
    );
    setTracks(res.data);
    setMeta(res.meta);
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  // Add a new track and reset to first page
  const add = useCallback(async (data: TrackDto) => {
    await createTrack(data);
    dispatch({ type: "SET_PAGE", payload: 1 });
  }, []);

  return { tracks, meta, query, dispatch, add };
};

import axios from "axios";
import { TrackDto } from "../types/trackDto";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const fetchTracks = async (
  page = 1,
  limit = 10,
  sort?: string,
  order?: "asc" | "desc",
  genre?: string,
  artist?: string
): Promise<{ data: Track[]; meta: Meta }> => {
  const { data } = await axios.get<{
    data: Track[];
    meta: Meta;
  }>("/api/tracks", {
    params: { page, limit, sort, order, genre, artist },
  });
  return data;
};

export const createTrack = async (track: TrackDto) => {
  const { data } = await axios.post<Track>("/api/tracks", track);
  return data;
};

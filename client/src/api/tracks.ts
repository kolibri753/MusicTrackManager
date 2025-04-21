import axios from "axios";
import { Track, TrackFormData, Meta } from "@/types/track";

export const fetchTracks = async (
  page = 1,
  limit = 10,
  sort?: keyof Track,
  order?: "asc" | "desc"
): Promise<{ data: Track[]; meta: Meta }> => {
  const { data } = await axios.get<{
    data: Track[];
    meta: Meta;
  }>("/api/tracks", {
    params: { page, limit, sort, order },
  });
  return data;
};

export const createTrack = async (track: TrackFormData) => {
  const { data } = await axios.post<Track>("/api/tracks", track);
  return data;
};

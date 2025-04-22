import axios from "axios";
import { Track, TrackFormData, Meta } from "@/types/track";

export const fetchTracks = async (
  page = 1,
  limit = 10,
  sort?: keyof Track,
  order?: "asc" | "desc",
  genre?: string,
  artist?: string,
  search?: string
): Promise<{ data: Track[]; meta: Meta }> => {
  const { data } = await axios.get<{
    data: Track[];
    meta: Meta;
  }>("/api/tracks", {
    params: { page, limit, sort, order, genre, artist, search },
  });
  return data;
};

export const createTrack = async (track: TrackFormData) => {
  const { data } = await axios.post<Track>("/api/tracks", track);
  return data;
};

export const updateTrack = async (
  id: string,
  track: TrackFormData
): Promise<Track> => {
  const { data } = await axios.put<Track>(`/api/tracks/${id}`, track);
  return data;
};

export const deleteTrack = async (id: string): Promise<void> => {
  await axios.delete(`/api/tracks/${id}`);
};

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

export const uploadTrackFile = async (
  id: string,
  file: File
): Promise<Track> => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await axios.post<Track>(`/api/tracks/${id}/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteTrackFile = async (id: string): Promise<Track> => {
  try {
    const { data } = await axios.delete<Track>(`/api/tracks/${id}/file`);
    return data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      const { data: track } = await axios.get<Track>(`/api/tracks/${id}`);
      const { audioFile, ...rest } = track;
      return rest as Track;
    }
    throw err;
  }
};

export const deleteMultipleTracks = async (
  ids: string[]
): Promise<{ success: string[]; failed: string[] }> => {
  const { data } = await axios.post<{
    success: string[];
    failed: string[];
  }>("/api/tracks/delete", { ids });
  return data;
};

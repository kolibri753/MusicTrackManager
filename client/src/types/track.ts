import type { TrackFormData } from "@/schemas/track";

export interface Track {
  id: string;
  slug: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
  createdAt: string;
  audioFile?: string;
}

export type { TrackFormData };

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

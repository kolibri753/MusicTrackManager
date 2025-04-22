export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
  createdAt: string;
  fileUrl?: string;
}

export type TrackFormData = Omit<Track, "id" | "createdAt">;

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

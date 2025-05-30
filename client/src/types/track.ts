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

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchTracksOptions {
  page?: number;
  limit?: number;
  sort?: keyof Track;
  order?: "asc" | "desc";
  genre?: string;
  artist?: string;
  search?: string;
}

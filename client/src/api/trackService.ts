import { IHttpClient } from "./httpClient";
import { Track, TrackFormData, Meta } from "@/types/track";

/**
 * Defines all operations for Track resources.
 */
export interface ITrackService {
  /** Fetches paginated tracks, with optional filters/sorting. */
  fetchTracks(
    page?: number,
    limit?: number,
    sort?: keyof Track,
    order?: "asc" | "desc",
    genre?: string,
    artist?: string,
    search?: string
  ): Promise<{ data: Track[]; meta: Meta }>;

  /** Fetch a single track by ID. */
  getTrackById(id: string): Promise<Track>;
  /** Create a new track. */
  createTrack(dto: TrackFormData): Promise<Track>;
  /** Update an existing track. */
  updateTrack(id: string, dto: TrackFormData): Promise<Track>;
  /** Delete a track. */
  deleteTrack(id: string): Promise<void>;

  /** Upload an audio file for a track. */
  uploadTrackFile(id: string, file: File): Promise<Track>;
  /** Delete the audio file associated with a track. */
  deleteTrackFile(id: string): Promise<Track>;

  /** Bulk-delete multiple tracks. */
  deleteMultipleTracks(
    ids: string[]
  ): Promise<{ success: string[]; failed: string[] }>;
}

/**
 * Service handling track‐related HTTP calls.
 */
export class TrackService implements ITrackService {
  constructor(private readonly http: IHttpClient) {}

  fetchTracks(
    page: number = 1,
    limit: number = 10,
    sort?: keyof Track,
    order?: "asc" | "desc",
    genre?: string,
    artist?: string,
    search?: string
  ): Promise<{ data: Track[]; meta: Meta }> {
    return this.http.get<{ data: Track[]; meta: Meta }>("/api/tracks", {
      params: { page, limit, sort, order, genre, artist, search },
    });
  }

  getTrackById(id: string): Promise<Track> {
    return this.http.get<Track>(`/api/tracks/${id}`);
  }

  createTrack(dto: TrackFormData): Promise<Track> {
    return this.http.post<Track>("/api/tracks", dto);
  }

  updateTrack(id: string, dto: TrackFormData): Promise<Track> {
    return this.http.put<Track>(`/api/tracks/${id}`, dto);
  }

  deleteTrack(id: string): Promise<void> {
    return this.http.delete<void>(`/api/tracks/${id}`);
  }

  uploadTrackFile(id: string, file: File): Promise<Track> {
    const form = new FormData();
    form.append("file", file);
    return this.http.post<Track>(`/api/tracks/${id}/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async deleteTrackFile(id: string): Promise<Track> {
    try {
      return await this.http.delete<Track>(`/api/tracks/${id}/file`);
    } catch (err: any) {
      if (err.response?.status === 404) {
        const track = await this.http.get<Track>(`/api/tracks/${id}`);
        const { audioFile, ...rest } = track;
        return rest as Track;
      }
      throw err;
    }
  }

  deleteMultipleTracks(
    ids: string[]
  ): Promise<{ success: string[]; failed: string[] }> {
    return this.http.post<{ success: string[]; failed: string[] }>(
      "/api/tracks/delete",
      { ids }
    );
  }
}

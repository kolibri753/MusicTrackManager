import { BaseService } from "./baseService";
import { type IHttpClient, HttpError } from "./httpClient";
import type { Track, Paginated } from "@/types";
import type { TrackFormData } from "@/schemas";

export interface FetchTracksOptions {
  page?: number;
  limit?: number;
  sort?: keyof Track;
  order?: "asc" | "desc";
  genre?: string;
  artist?: string;
  search?: string;
}

export class TrackService extends BaseService<Track, TrackFormData> {
  protected static readonly resource = "tracks";
  constructor(http: IHttpClient) {
    super(http, TrackService.resource);
  }

  /**
   * GET /api/tracks/:slug
   */
  getBySlug(slug: string): Promise<Track> {
    return this.http.get<Track>(`/api/${TrackService.resource}/${slug}`);
  }

  /**
   * GET /tracks (paginated)
   */
  fetchTracks(
    opts: FetchTracksOptions = {},
    signal?: AbortSignal
  ): Promise<Paginated<Track>> {
    const { page = 1, limit = 10, ...filters } = opts;
    return this.http.get<Paginated<Track>>(`/api/${TrackService.resource}`, {
      params: { page, limit, ...filters },
      signal,
    });
  }

  /**
   * POST /tracks/:id/upload
   */
  uploadTrackFile(id: string, file: File): Promise<Track> {
    const form = new FormData();
    form.append("file", file);
    return this.http.post<Track>(
      `/api/${TrackService.resource}/${id}/upload`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }

  /**
   * DELETE /tracks/:id/file (404-safe)
   */
  async deleteTrackFile(id: string): Promise<Track> {
    try {
      return await this.http.delete<Track>(
        `/api/${TrackService.resource}/${id}/file`
      );
    } catch (err: unknown) {
      if (err instanceof HttpError && err.status === 404) {
        const track = await this.getById(id);
        delete track.audioFile;
        return track;
      }
      throw err;
    }
  }

  /**
   * POST /tracks/delete
   */
  deleteMultipleTracks(
    ids: string[]
  ): Promise<{ success: string[]; failed: string[] }> {
    return this.http.post<{ success: string[]; failed: string[] }>(
      `/api/${TrackService.resource}/delete`,
      { ids }
    );
  }
}

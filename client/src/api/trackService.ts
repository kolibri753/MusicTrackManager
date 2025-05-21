import { BaseService } from "./baseService";
import { IHttpClient } from "./httpClient";
import { Track, TrackFormData, Paginated } from "@/types";

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
    return this.http.get(`/api/${TrackService.resource}/${slug}`);
  }

  /**
   * GET /tracks (paginated)
   */
  fetchTracks(
    opts: FetchTracksOptions = {},
    signal?: AbortSignal
  ): Promise<Paginated<Track>> {
    const { page = 1, limit = 10, ...filters } = opts;
    return this.http.get(`/api/${TrackService.resource}`, {
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
    return this.http.post(`/api/${TrackService.resource}/${id}/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * DELETE /tracks/:id/file (404-safe)
   */
  async deleteTrackFile(id: string): Promise<Track> {
    try {
      return await this.http.delete(`/api/${TrackService.resource}/${id}/file`);
    } catch (err: any) {
      if (err.response?.status === 404) {
        const { audioFile, ...track } = await this.getById(id);
        return track as Track;
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
    return this.http.post(`/api/${TrackService.resource}/delete`, { ids });
  }
}

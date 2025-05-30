import type { Result } from "neverthrow";
import { BaseService } from "./baseService";
import type { IHttpClient } from "./httpClient";
import type { AppError } from "./errors";
import type { Track, Paginated, FetchTracksOptions } from "@/types";
import type { TrackFormData } from "@/schemas";

/**
 * TrackService — thin wrapper over /api/tracks endpoints.
 */
export class TrackService extends BaseService<Track, TrackFormData> {
  protected static readonly resource = "tracks";

  constructor(http: IHttpClient) {
    super(http, TrackService.resource);
  }

  /**
   * GET /api/tracks/:slug
   */
  getBySlug(slug: string): Promise<Result<Track, AppError>> {
    return this.http.get<Track>(`/api/${TrackService.resource}/${slug}`);
  }

  /**
   * GET /tracks (paginated)
   */
  fetchTracks(
    opts: FetchTracksOptions = {},
    signal?: AbortSignal
  ): Promise<Result<Paginated<Track>, AppError>> {
    const { page = 1, limit = 10, ...filters } = opts;
    return this.http.get<Paginated<Track>>(`/api/${TrackService.resource}`, {
      params: { page, limit, ...filters },
      signal,
    });
  }

  /**
   * POST /tracks/:id/upload
   */
  uploadTrackFile(id: string, file: File): Promise<Result<Track, AppError>> {
    const form = new FormData();
    form.append("file", file);
    return this.http.post<Track>(
      `/api/${TrackService.resource}/${id}/upload`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  }

  /**
   * DELETE /tracks/:id/file (404-safe)
   */
  async deleteTrackFile(id: string): Promise<Result<Track, AppError>> {
    const res = await this.http.delete<Track>(
      `/api/${TrackService.resource}/${id}/file`
    );
    if (res.isErr() && res.error.type === "NotFound") {
      return this.getById(id);
    }
    return res;
  }

  /**
   * POST /tracks/delete
   */
  deleteMultipleTracks(
    ids: string[]
  ): Promise<Result<{ success: string[]; failed: string[] }, AppError>> {
    return this.http.post<{ success: string[]; failed: string[] }>(
      `/api/${TrackService.resource}/delete`,
      { ids }
    );
  }
}

import { BaseService } from "./baseService";
import { IHttpClient } from "./httpClient";

/**
 * Defines operations for fetching genre data.
 */
export interface IGenreService {
  /** Fetch all genre names. */
  listGenres(): Promise<string[]>;
  /** Fetch a single genre by ID. */
  getGenreById(id: string): Promise<string>;
}

/**
 * Service handling genre‐related HTTP calls via BaseService.
 */
export class GenreService extends BaseService<string> implements IGenreService {
  constructor(http: IHttpClient) {
    super(http, "genres");
  }

  listGenres(): Promise<string[]> {
    return this.list();
  }

  getGenreById(id: string): Promise<string> {
    return this.getById(id);
  }
}

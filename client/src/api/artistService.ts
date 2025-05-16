import { BaseService } from "./baseService";
import { IHttpClient } from "./httpClient";

/**
 * Defines operations for fetching artist data.
 */
export interface IArtistService {
  /** Fetch all artist names. */
  listArtists(): Promise<string[]>;
  /** Fetch a single artist by ID. */
  getArtistById(id: string): Promise<string>;
}

/**
 * Service handling artist‐related HTTP calls via BaseService.
 */
export class ArtistService
  extends BaseService<string>
  implements IArtistService
{
  constructor(http: IHttpClient) {
    super(http, "artists");
  }

  listArtists(): Promise<string[]> {
    return this.list();
  }

  getArtistById(id: string): Promise<string> {
    return this.getById(id);
  }
}

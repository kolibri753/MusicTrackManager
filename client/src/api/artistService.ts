import { BaseService } from "./baseService";
import { IHttpClient } from "./httpClient";

export class ArtistService extends BaseService<string> {
  protected static readonly resource = "artists";
  constructor(http: IHttpClient) {
    super(http, ArtistService.resource);
  }
}

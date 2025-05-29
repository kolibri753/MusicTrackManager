import { BaseService } from "./baseService";
import { type IHttpClient } from "./httpClient";

export class GenreService extends BaseService<string> {
  protected static readonly resource = "genres";
  
  constructor(http: IHttpClient) {
    super(http, GenreService.resource);
  }
}

import { AxiosHttpClient } from "./httpClient";
import { ArtistService } from "./artistService";
import { GenreService } from "./genreService";
import { TrackService } from "./trackService";

const http = new AxiosHttpClient();

export const artistService = new ArtistService(http);
export const genreService = new GenreService(http);
export const trackService = new TrackService(http);

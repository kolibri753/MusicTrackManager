import { AxiosHttpClient } from "./httpClient";
import { ArtistService, IArtistService } from "./artistService";
import { GenreService, IGenreService } from "./genreService";
import { TrackService, ITrackService } from "./trackService";

const httpClient = new AxiosHttpClient();

export const artistService: IArtistService = new ArtistService(httpClient);
export const genreService: IGenreService = new GenreService(httpClient);
export const trackService: ITrackService = new TrackService(httpClient);

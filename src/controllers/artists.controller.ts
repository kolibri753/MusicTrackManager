import { getArtists } from "../utils/db";
import { RouteHandler } from "../types";

/**
 * Get all artists (distinct)
 */
export const getAllArtists: RouteHandler<{}> = async (request, reply) => {
  try {
    const artists = await getArtists();
    return reply.code(200).send(artists);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
};

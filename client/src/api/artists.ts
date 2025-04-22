import axios from "axios";

export const getArtists = async (): Promise<string[]> => {
  const { data } = await axios.get<string[]>("/api/artists");
  return data;
};

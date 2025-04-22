import { useState, useEffect } from "react";
import { getArtists } from "@/api/artists";

export const useArtists = () => {
  const [artists, setArtists] = useState<string[]>([]);
  useEffect(() => {
    getArtists().then(setArtists).catch(console.error);
  }, []);
  return artists;
};

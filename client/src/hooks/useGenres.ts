import { useState, useEffect } from "react";
import { getGenres } from "@/api/genres";

export const useGenres = () => {
  const [genres, setGenres] = useState<string[]>([]);
  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []);
  return genres;
};

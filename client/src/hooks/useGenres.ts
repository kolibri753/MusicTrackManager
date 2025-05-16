import { useState, useEffect } from "react";
import { genreService } from "@/api";

/**
 * Custom hook to fetch and keep an up-to-date list of genre names.
 */
export function useGenres(): string[] {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    genreService
      .listGenres()
      .then((data) => {
        if (mounted) setGenres(data);
      })
      .catch((err) => {
        console.error("Failed to load genres:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return genres;
}

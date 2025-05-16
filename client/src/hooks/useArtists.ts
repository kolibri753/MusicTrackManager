import { useState, useEffect } from "react";
import { artistService } from "@/api";

/**
 * Custom hook to fetch and keep an up-to-date list of artist names.
 */
export function useArtists(): string[] {
  const [artists, setArtists] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    artistService
      .listArtists()
      .then((data) => {
        if (mounted) setArtists(data);
      })
      .catch((err) => {
        console.error("Failed to load artists:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return artists;
}

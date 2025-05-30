import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackFormSchema } from "@/schemas";
import type { TrackFormData } from "@/schemas";

export interface UseTrackFormArgs {
  initial?: TrackFormData;
}

export function useTrackForm({ initial }: UseTrackFormArgs) {
  return useForm<TrackFormData>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: initial ?? {
      title: "",
      artist: "",
      album: "",
      coverImage: "",
      genres: [],
    },
  });
}

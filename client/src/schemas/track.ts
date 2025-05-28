import { z } from "zod";

export const trackFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string().optional(),
  genres: z.array(z.string()).min(1, "Select at least one genre"),
  coverImage: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

export type TrackFormData = z.infer<typeof trackFormSchema>;

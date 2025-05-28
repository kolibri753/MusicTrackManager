import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackFormSchema, TrackFormData } from "@/schemas/track";
import { extractErrorMessage, showToastMessage } from "@/helpers";

export interface UseTrackFormArgs {
  initial?: TrackFormData;
  onSubmit(data: TrackFormData): Promise<void>;
}

export function useTrackForm({ initial, onSubmit }: UseTrackFormArgs) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackFormData>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: initial ?? {
      title: "",
      artist: "",
      album: "",
      coverImage: "",
      genres: [],
    },
  });

  const submit = useCallback(
    handleSubmit(async (data) => {
      try {
        await onSubmit(data);
      } catch (err) {
        showToastMessage("error", extractErrorMessage(err));
      }
    }),
    [handleSubmit, onSubmit]
  );

  return { register, control, errors, isSubmitting, submit };
}

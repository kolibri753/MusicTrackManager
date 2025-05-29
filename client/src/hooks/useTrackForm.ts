import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TrackFormData } from "@/schemas";
import { trackFormSchema } from "@/schemas";
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

  const submit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      showToastMessage("error", extractErrorMessage(err));
    }
  });

  return { register, control, errors, isSubmitting, submit };
}

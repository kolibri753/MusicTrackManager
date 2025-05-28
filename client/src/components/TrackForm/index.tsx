import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackFormSchema } from "@/schemas";
import type { TrackFormData } from "@/schemas";
import { TrackFormFields } from "./fields";

interface Props {
  initialData?: TrackFormData;
  genres: { list: string[]; loading: boolean; error: boolean };
  onSubmit(data: TrackFormData): Promise<void>;
  onCancel(): void;
}

export function TrackForm({ initialData, genres, onSubmit, onCancel }: Props) {
  const initialValues: TrackFormData = initialData ?? {
    title: "",
    artist: "",
    album: "",
    genres: [],
    coverImage: "",
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackFormData>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: initialValues,
  });

  return (
    <form
      data-testid="track-form"
      data-loading={isSubmitting ? "true" : undefined}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <TrackFormFields
        register={register}
        control={control}
        errors={errors}
        disabled={isSubmitting}
        genres={genres}
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          data-testid="cancel-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="submit-button"
          className="btn btn-primary"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span
              data-testid="loading-indicator"
              className="loading loading-spinner loading-xs"
            />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}

import { TrackFormFields } from "./fields";
import { useTrackForm } from "@/hooks";
import type { TrackFormData } from "@/schemas";
import type { ResourceState } from "@/types";

interface Props {
  initialData?: TrackFormData;
  genres: ResourceState<string>;
  onSubmit(data: TrackFormData): Promise<void>;
  onCancel(): void;
}

export function TrackForm({ initialData, genres, onSubmit, onCancel }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useTrackForm({ initial: initialData });

  return (
    <form
      data-testid="track-form"
      data-loading={isSubmitting || undefined}
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

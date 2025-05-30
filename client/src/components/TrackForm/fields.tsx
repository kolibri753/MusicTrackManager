import { Controller } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { TagSelector } from "@/components";
import type { TrackFormData } from "@/schemas";
import type { ResourceState } from "@/types";

interface Props {
  register: UseFormRegister<TrackFormData>;
  control: Control<TrackFormData>;
  errors: FieldErrors<TrackFormData>;
  disabled: boolean;
  genres: ResourceState<string>;
}

export function TrackFormFields({
  register,
  control,
  errors,
  disabled,
  genres,
}: Props) {
  return (
    <>
      <div>
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          {...register("title")}
          className="input input-bordered w-full"
          disabled={disabled}
        />
        {errors.title && (
          <p className="text-error text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Artist</span>
        </label>
        <input
          {...register("artist")}
          className="input input-bordered w-full"
          disabled={disabled}
        />
        {errors.artist && (
          <p className="text-error text-sm mt-1">{errors.artist.message}</p>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Album</span>
        </label>
        <input
          {...register("album")}
          className="input input-bordered w-full"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Genres</span>
        </label>
        <Controller
          control={control}
          name="genres"
          render={({ field }) => (
            <TagSelector
              {...field}
              options={genres.list}
              loading={genres.loading}
              error={!!genres.error}
            />
          )}
        />
        {errors.genres && (
          <p className="text-error text-sm mt-1">{errors.genres.message}</p>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Cover Image URL</span>
        </label>
        <input
          {...register("coverImage")}
          className="input input-bordered w-full"
          disabled={disabled}
        />
        {errors.coverImage && (
          <p className="text-error text-sm mt-1">{errors.coverImage.message}</p>
        )}
      </div>
    </>
  );
}

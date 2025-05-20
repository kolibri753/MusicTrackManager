import { useState, FormEvent } from "react";
import { TagSelector } from "@/components";
import { Track, TrackFormData } from "@/types";
import { useGenres } from "@/hooks";

export function TrackForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Track;
  onSubmit(data: TrackFormData): Promise<void>;
  onCancel(): void;
}) {
  const {
    genres: genreList,
    loading: genresLoading,
    error: genresError,
  } = useGenres();

  const [form, setForm] = useState<TrackFormData>({
    title: initialData?.title || "",
    artist: initialData?.artist || "",
    album: initialData?.album || "",
    genres: initialData?.genres || [],
    coverImage: initialData?.coverImage || "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TrackFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: any = {};
    if (!form.title) errs.title = "Title is required";
    if (!form.artist) errs.artist = "Artist is required";
    if (form.genres.length === 0) errs.genres = "Select at least one genre";
    if (form.coverImage && !/^https?:\/\/.+\..+/.test(form.coverImage))
      errs.coverImage = "Invalid URL";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      data-testid="track-form"
      data-loading={loading ? "true" : undefined}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label htmlFor="title" className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          id="title"
          data-testid="input-title"
          className="input input-bordered w-full"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          disabled={loading}
          aria-disabled={loading}
        />
        {errors.title && (
          <p data-testid="error-title" className="text-error text-sm mt-1">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="artist" className="label">
          <span className="label-text">Artist</span>
        </label>
        <input
          id="artist"
          data-testid="input-artist"
          className="input input-bordered w-full"
          value={form.artist}
          onChange={(e) => setForm({ ...form, artist: e.target.value })}
          disabled={loading}
          aria-disabled={loading}
        />
        {errors.artist && (
          <p data-testid="error-artist" className="text-error text-sm mt-1">
            {errors.artist}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="album" className="label">
          <span className="label-text">Album</span>
        </label>
        <input
          id="album"
          data-testid="input-album"
          className="input input-bordered w-full"
          value={form.album}
          onChange={(e) => setForm({ ...form, album: e.target.value })}
          disabled={loading}
          aria-disabled={loading}
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Genres</span>
        </label>
        <div data-testid="genre-selector">
          <TagSelector
            value={form.genres}
            options={genreList}
            loading={genresLoading}
            error={!!genresError}
            onChange={(genres) => setForm({ ...form, genres })}
          />
        </div>
        {errors.genres && (
          <p data-testid="error-genre" className="text-error text-sm mt-1">
            {errors.genres}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="coverImage" className="label">
          <span className="label-text">Cover Image URL</span>
        </label>
        <input
          id="coverImage"
          data-testid="input-cover-image"
          className="input input-bordered w-full"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          disabled={loading}
          aria-disabled={loading}
        />
        {errors.coverImage && (
          <p data-testid="error-coverImage" className="text-error text-sm mt-1">
            {errors.coverImage}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={loading}
          aria-disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="submit-button"
          className="btn btn-primary"
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? (
            <span
              data-testid="loading-indicator"
              className="loading loading-spinner loading-xs"
              data-loading="true"
            ></span>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}

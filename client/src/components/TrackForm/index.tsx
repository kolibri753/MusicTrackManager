// client/src/components/TrackForm/index.tsx
import { useState } from "react";
import { TagSelector } from "../Form/TagSelector";
import { Track, TrackFormData } from "@/types";

export function TrackForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Track;
  onSubmit(data: TrackFormData): Promise<void>;
  onCancel(): void;
}) {
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
    if (form.coverImage && !/^https?:\/\/.+\..+/.test(form.coverImage))
      errs.coverImage = "Invalid URL";
    if (form.genres.length === 0) errs.genres = "Select at least one genre";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/** Title **/}
      <div>
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          className="input input-bordered w-full"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        {errors.title && (
          <p className="text-error text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/** Artist **/}
      <div>
        <label className="label">
          <span className="label-text">Artist</span>
        </label>
        <input
          className="input input-bordered w-full"
          value={form.artist}
          onChange={(e) => setForm({ ...form, artist: e.target.value })}
        />
        {errors.artist && (
          <p className="text-error text-sm mt-1">{errors.artist}</p>
        )}
      </div>

      {/** Album **/}
      <div>
        <label className="label">
          <span className="label-text">Album</span>
        </label>
        <input
          className="input input-bordered w-full"
          value={form.album}
          onChange={(e) => setForm({ ...form, album: e.target.value })}
        />
      </div>

      {/** Genres **/}
      <div>
        <label className="label">
          <span className="label-text">Genres</span>
        </label>
        <TagSelector
          value={form.genres}
          onChange={(genres) => setForm({ ...form, genres })}
        />
        {errors.genres && (
          <p className="text-error text-sm mt-1">{errors.genres}</p>
        )}
      </div>

      {/** Cover Image **/}
      <div>
        <label className="label">
          <span className="label-text">Cover Image URL</span>
        </label>
        <input
          className="input input-bordered w-full"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
        />
        {errors.coverImage && (
          <p className="text-error text-sm mt-1">{errors.coverImage}</p>
        )}
      </div>

      {/** Actions **/}
      <div className="flex justify-end gap-2">
        <button className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

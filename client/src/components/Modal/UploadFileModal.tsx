import React from "react";
import { Modal } from "./index";
import type { Track } from "@/types/track";

interface UploadFileModalProps {
  track: Track;
  onUpload(file: File): Promise<void>;
  onCancel(): void;
}

export function UploadFileModal({
  track,
  onUpload,
  onCancel,
}: UploadFileModalProps) {
  const [error, setError] = React.useState<string>("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await onUpload(file);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Modal onClose={onCancel} data-testid="upload-dialog">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Upload file for “{track.title}”
        </h2>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Pick a file</legend>
          <input
            type="file"
            accept="audio/*"
            className="file-input"
            data-testid="input-file"
            onChange={handleChange}
          />
          <label className="label">
            <span className="label-text">
              MP3, WAV… max size enforced by server (10MB)
            </span>
          </label>
          {error && (
            <p className="text-error text-sm mt-1" data-testid="error-file">
              {error}
            </p>
          )}
        </fieldset>

        <div className="flex justify-end">
          <button
            className="btn btn-outline"
            onClick={onCancel}
            data-testid="cancel-upload"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

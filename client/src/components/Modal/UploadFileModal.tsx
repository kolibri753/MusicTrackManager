import React from "react";
import { Modal } from "./index";
import type { Track } from "@/types";

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
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUpload(file);
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

import React, { useEffect, useMemo, useState } from "react";
import { useTracks, useArtists, useGenres } from "@/hooks";
import {
  DeleteConfirmationModal,
  Modal,
  TrackForm,
  TrackTable,
  UploadFileModal,
  TrackToolbar,
} from "@/components";
import type { Track } from "@/types";
import type { TrackFormData } from "@/schemas";
import { trackService } from "@/api";
import { extractErrorMessage, showToastMessage } from "@/helpers";

const TracksPage: React.FC = () => {
  const {
    data,
    meta: { totalPages },
    page,
    limit,
    setPage,
    setLimit,
    sort,
    order,
    setSort,
    setOrder,
    genre: filterGenre,
    setGenre: setFilterGenre,
    artist: filterArtist,
    setArtist: setFilterArtist,
    search,
    setSearch,
    refetch: refetchTracks,
  } = useTracks();
  const memoData = useMemo(() => data, [data]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [page, totalPages, setPage]);

  const genres = useGenres();
  const artists = useArtists();

  const [isCreating, setIsCreating] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<Track | null>(null);
  const [uploadingTrack, setUploadingTrack] = useState<Track | null>(null);
  const [deletingFileTrack, setDeletingFile] = useState<Track | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  const handleCreate = async (form: TrackFormData) => {
    try {
      await trackService.create(form);
      showToastMessage("success", "Track created successfully");
      await Promise.all([refetchTracks(), artists.refetch()]);
    } catch (e) {
      showToastMessage("error", extractErrorMessage(e));
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (form: TrackFormData) => {
    if (!editingTrack) return;

    const fields: (keyof TrackFormData)[] = [
      "title",
      "artist",
      "genres",
      "album",
      "coverImage",
    ];
    if (fields.every((k) => editingTrack[k] === form[k])) {
      setEditingTrack(null);
      return;
    }

    try {
      await trackService.update(editingTrack.id, form);
      showToastMessage("success", "Track updated successfully");
      await Promise.all([refetchTracks(), artists.refetch()]);
    } catch (e) {
      showToastMessage("error", extractErrorMessage(e));
    } finally {
      setEditingTrack(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingTrack) return;
    try {
      await trackService.delete(deletingTrack.id);
      showToastMessage("success", "Track deleted successfully");
      await Promise.all([refetchTracks(), artists.refetch()]);
    } catch (e) {
      showToastMessage("error", extractErrorMessage(e));
    } finally {
      setDeletingTrack(null);
    }
  };

  const confirmUpload = async (file: File) => {
    if (!uploadingTrack) return;
    try {
      await trackService.uploadTrackFile(uploadingTrack.id, file);
      showToastMessage("success", "File uploaded");
      await refetchTracks();
    } catch (e) {
      showToastMessage("error", extractErrorMessage(e));
    } finally {
      setUploadingTrack(null);
    }
  };

  const confirmDeleteFile = async () => {
    if (!deletingFileTrack) return;
    try {
      await trackService.deleteTrackFile(deletingFileTrack.id);
      showToastMessage("success", "File removed");
      await Promise.all([refetchTracks(), artists.refetch()]);
    } catch (e) {
      showToastMessage("error", extractErrorMessage(e));
    } finally {
      setDeletingFile(null);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const { success, failed } = await trackService.deleteMultipleTracks(ids);
      showToastMessage(
        "success",
        `Deleted ${success.length} track${success.length === 1 ? "" : "s"}`
      );
      if (failed.length)
        showToastMessage("error", `Failed to delete: ${failed.join(", ")}`);
      await Promise.all([refetchTracks(), artists.refetch()]);
    } catch (e) {
      showToastMessage("error", extractErrorMessage(e));
    } finally {
      setBulkDeleteIds([]);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tracks</h1>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreating(true)}
            data-testid="create-track-button"
          >
            New Track
          </button>
        </div>

        <TrackToolbar
          artists={artists}
          genres={genres}
          filterArtist={filterArtist}
          setFilterArtist={setFilterArtist}
          filterGenre={filterGenre}
          setFilterGenre={setFilterGenre}
          search={search}
          setSearch={setSearch}
        />

        <TrackTable
          data={memoData}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
          page={page}
          totalPages={totalPages}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          onEdit={setEditingTrack}
          onDelete={setDeletingTrack}
          onUploadClick={setUploadingTrack}
          onDeleteFile={setDeletingFile}
          onBulkDelete={setBulkDeleteIds}
        />

        {isCreating && (
          <Modal onClose={() => setIsCreating(false)}>
            <TrackForm
              onSubmit={handleCreate}
              genres={genres}
              onCancel={() => setIsCreating(false)}
            />
          </Modal>
        )}

        {editingTrack && (
          <Modal onClose={() => setEditingTrack(null)}>
            <TrackForm
              initialData={editingTrack}
              genres={genres}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTrack(null)}
            />
          </Modal>
        )}

        {deletingTrack && (
          <DeleteConfirmationModal
            title={`Delete "${deletingTrack.title}"?`}
            onConfirm={confirmDelete}
            onCancel={() => setDeletingTrack(null)}
          />
        )}

        {uploadingTrack && (
          <UploadFileModal
            track={uploadingTrack}
            onUpload={confirmUpload}
            onCancel={() => setUploadingTrack(null)}
          />
        )}

        {deletingFileTrack && (
          <DeleteConfirmationModal
            title={`Remove audio from “${deletingFileTrack.title}”?`}
            onConfirm={confirmDeleteFile}
            onCancel={() => setDeletingFile(null)}
          />
        )}

        {bulkDeleteIds.length > 0 && (
          <DeleteConfirmationModal
            title={`Delete ${bulkDeleteIds.length} track${
              bulkDeleteIds.length > 1 ? "s" : ""
            }?`}
            onConfirm={() => handleBulkDelete(bulkDeleteIds)}
            onCancel={() => setBulkDeleteIds([])}
          />
        )}
      </div>
    </div>
  );
};

export default TracksPage;

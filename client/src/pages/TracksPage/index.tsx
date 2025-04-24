import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTracks, useArtists, useGenres } from "@/hooks";
import {
  DeleteConfirmationModal,
  Header,
  Modal,
  TrackForm,
  TrackTable,
  UploadFileModal,
} from "@/components";
import type { Track, TrackFormData } from "@/types";
import {
  createTrack,
  updateTrack,
  deleteTrack,
  deleteTrackFile,
  uploadTrackFile,
} from "@/api/tracks";
import { extractErrorMessage } from "@/helpers";

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
    filterGenre,
    setFilterGenre,
    filterArtist,
    setFilterArtist,
    search,
    setSearch,
    refetch,
  } = useTracks();

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [page, totalPages, setPage]);

  const artists = useArtists();
  const genres = useGenres();

  const [isCreating, setIsCreating] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<Track | null>(null);
  const [uploadingTrack, setUploadingTrack] = useState<Track | null>(null);
  const [deletingFileTrack, setDeletingFileTrack] = useState<Track | null>(
    null
  );

  const handleCreate = async (form: TrackFormData) => {
    try {
      await createTrack(form);
      toast.success(
        <span data-testid="toast-success">Track created successfully</span>
      );
    } catch (err: any) {
      toast.error(
        <span data-testid="toast-error">{extractErrorMessage(err)}</span>
      );
    } finally {
      setIsCreating(false);
      await refetch();
    }
  };

  const handleEditClick = (id: string) => {
    setEditingTrack(data.find((t) => t.id === id) || null);
  };
  const handleUpdate = async (form: TrackFormData) => {
    if (!editingTrack) return;
    try {
      await updateTrack(editingTrack.id, form);
      toast.success(
        <span data-testid="toast-success">Track updated successfully</span>
      );
    } catch (err: any) {
      toast.error(
        <span data-testid="toast-error">{extractErrorMessage(err)}</span>
      );
    } finally {
      setEditingTrack(null);
      await refetch();
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingTrack(data.find((t) => t.id === id) || null);
  };
  const confirmDelete = async () => {
    if (!deletingTrack) return;
    try {
      await deleteTrack(deletingTrack.id);
      toast.success(
        <span data-testid="toast-success">Track deleted successfully</span>
      );
    } catch (err: any) {
      toast.error(
        <span data-testid="toast-error">{extractErrorMessage(err)}</span>
      );
    } finally {
      setDeletingTrack(null);
      await refetch();
    }
  };

  const handleUploadClick = (id: string) =>
    setUploadingTrack(data.find((t) => t.id === id) || null);

  const confirmUpload = async (file: File) => {
    if (!uploadingTrack) return;
    try {
      await uploadTrackFile(uploadingTrack.id, file);
      toast.success(<span data-testid="toast-success">File uploaded</span>);
    } catch (err: any) {
      toast.error(
        <span data-testid="toast-error">{extractErrorMessage(err)}</span>
      );
    } finally {
      setUploadingTrack(null);
      await refetch();
    }
  };

  const handleDeleteFileClick = (id: string) => {
    setDeletingFileTrack(data.find((t) => t.id === id) || null);
  };
  const confirmDeleteFile = async () => {
    if (!deletingFileTrack) return;
    try {
      await deleteTrackFile(deletingFileTrack.id);
      toast.success(<span data-testid="toast-success">File removed</span>);
    } catch (err: any) {
      toast.error(
        <span data-testid="toast-error">{extractErrorMessage(err)}</span>
      );
    } finally {
      setDeletingFileTrack(null);
      await refetch();
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
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

        <TrackTable
          data={data}
          genres={genres}
          artists={artists}
          page={page}
          totalPages={totalPages}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
          filterGenre={filterGenre}
          onFilterGenreChange={setFilterGenre}
          filterArtist={filterArtist}
          onFilterArtistChange={setFilterArtist}
          search={search}
          onSearchChange={setSearch}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onUploadClick={handleUploadClick}
          onDeleteFile={handleDeleteFileClick}
        />

        {isCreating && (
          <Modal onClose={() => setIsCreating(false)}>
            <TrackForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(false)}
            />
          </Modal>
        )}

        {editingTrack && (
          <Modal onClose={() => setEditingTrack(null)}>
            <TrackForm
              initialData={editingTrack}
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
            onCancel={() => setDeletingFileTrack(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TracksPage;

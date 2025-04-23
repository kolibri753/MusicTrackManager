import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTracks, useArtists, useGenres } from "@/hooks";
import {
  DeleteConfirmationModal,
  Header,
  Modal,
  TrackForm,
  TrackTable,
} from "@/components";
import type { Track, TrackFormData } from "@/types";
import { createTrack, updateTrack, deleteTrack } from "@/api/tracks";

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

  const extractMsg = (err: any) =>
    err?.response?.data?.error || err.message || "Something went wrong";

  const handleCreate = async (form: TrackFormData) => {
    try {
      await createTrack(form);
      toast.success(
        <span data-testid="toast-success">Track created successfully</span>
      );
    } catch (err: any) {
      toast.error(<span data-testid="toast-error">{extractMsg(err)}</span>);
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
      toast.error(<span data-testid="toast-error">{extractMsg(err)}</span>);
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
      toast.error(<span data-testid="toast-error">{extractMsg(err)}</span>);
    } finally {
      setDeletingTrack(null);
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
            title={deletingTrack.title}
            onConfirm={confirmDelete}
            onCancel={() => setDeletingTrack(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TracksPage;

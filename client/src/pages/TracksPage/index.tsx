import React, { useEffect, useState } from "react";
import { useTracks, useArtists, useGenres } from "@/hooks";
import {
  DeleteConfirmationModal,
  Header,
  Modal,
  TrackForm,
  TrackTable,
} from "@/components";
import { Track } from "@/types";
import { deleteTrack, updateTrack } from "@/api/tracks";

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
    if (page > totalPages) {
      setPage(totalPages > 0 ? totalPages : 1);
    }
  }, [page, totalPages, setPage]);

  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<Track | null>(null);

  const handleEdit = (id: string) => {
    const track = data.find((t) => t.id === id);
    if (track) setEditingTrack(track);
  };

  const closeEdit = () => setEditingTrack(null);

  const handleDelete = (id: string) => {
    const track = data.find((t) => t.id === id);
    if (track) setDeletingTrack(track);
  };

  const confirmDelete = async () => {
    if (!deletingTrack) return;
    await deleteTrack(deletingTrack.id);
    setDeletingTrack(null);
    await refetch();
  };

  const genres = useGenres();
  const artists = useArtists();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Tracks</h1>
        <TrackTable
          data={data}
          genres={genres}
          artists={artists}
          refetch={refetch}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
        />

        {editingTrack && (
          <Modal onClose={closeEdit}>
            <TrackForm
              initialData={editingTrack}
              onSubmit={async (formData) => {
                await updateTrack(editingTrack.id, formData);
                closeEdit();
                await refetch();
              }}
              onCancel={closeEdit}
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

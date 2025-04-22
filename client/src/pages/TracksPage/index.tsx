import React from "react";
import { useTracks, useArtists, useGenres } from "@/hooks";
import { Header, TrackTable } from "@/components";

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
  } = useTracks();

  const handleEdit = (id: string) => console.log("edit", id);
  const handleDelete = (id: string) => console.log("delete", id);

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
      </div>
    </div>
  );
};

export default TracksPage;

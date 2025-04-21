import React from "react";
import { useTracks } from "@/hooks/useTracks";
import { TrackTable } from "@/components";

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Tracks</h1>
      <TrackTable
        data={data}
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
  );
};

export default TracksPage;

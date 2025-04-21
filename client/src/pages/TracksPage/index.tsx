import React from "react";
import { useTracks } from "@/hooks/useTracks";
import { TrackTable } from "@/components";

const TracksPage: React.FC = () => {
  const { data, page, limit, setPage, setLimit, setSort, setOrder } =
    useTracks();

  // placeholder edit/delete handlers
  const handleEdit = (id: string) => console.log("edit", id);
  const handleDelete = (id: string) => console.log("delete", id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Tracks</h1>
      <TrackTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default TracksPage;

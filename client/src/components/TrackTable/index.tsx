import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import type { Track } from "@/types/track";
import { getColumns } from "./columns";
import { PaginationControls } from "./PaginationControls";

interface Props {
  data: Track[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  limit: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  sort: keyof Track;
  order: "asc" | "desc";
  setSort: (f: keyof Track) => void;
  setOrder: (o: "asc" | "desc") => void;
}

export const TrackTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
  page,
  totalPages,
  limit,
  setPage,
  setLimit,
  sort,
  order,
  setSort,
  setOrder,
}) => {
  // 1) control sorting state locally
  const [sorting, setSorting] = useState<SortingState>([
    { id: sort, desc: order === "desc" },
  ]);

  // 2) if user sorts anything *but* genres, push to server
  useEffect(() => {
    if (!sorting.length) return;
    const [{ id, desc }] = sorting;
    if (id !== "genres") {
      setSort(id as keyof Track);
      setOrder(desc ? "desc" : "asc");
    }
  }, [sorting, setSort, setOrder]);

  const columns = useMemo(
    () => getColumns(onEdit, onDelete),
    [onEdit, onDelete]
  );

  // 3) switch between server- and client-side sorting
  const isManual = sorting[0]?.id !== "genres";

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    // if sorting by anything except "genres", we assume data is already server-sorted
    manualSorting: isManual,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    // only used when manualSorting === false
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <table className="table w-full">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
      />
    </>
  );
};

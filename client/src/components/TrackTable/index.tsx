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
  // 1) keep local sorting state in sync with your sort/order props
  const [sorting, setSorting] = useState<SortingState>([
    { id: sort, desc: order === "desc" },
  ]);

  // 2) whenever sorting changes *and* it's NOT genres, push it back to server
  useEffect(() => {
    if (!sorting.length) return;
    const { id, desc } = sorting[0];
    if (id !== "genres") {
      setSort(id as keyof Track);
      setOrder(desc ? "desc" : "asc");
    }
    // if id === "genres", we do *no* server call
  }, [sorting, setSort, setOrder]);

  const columns = useMemo(
    () => getColumns(onEdit, onDelete),
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    manualSorting: sort !== "genres",
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
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

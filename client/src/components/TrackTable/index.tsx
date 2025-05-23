import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { Track } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SelectModeToggle } from "@/components";
import { getColumns, SelectionOptions } from "./columns";
import { PaginationControls } from "./PaginationControls";

export interface TrackTableProps {
  data: Track[];
  sort: keyof Track;
  order: "asc" | "desc";
  setSort(v: keyof Track): void;
  setOrder(v: "asc" | "desc"): void;
  page: number;
  totalPages: number;
  limit: number;
  setPage(p: number): void;
  setLimit(l: number): void;
  onEdit(id: string): void;
  onDelete(id: string): void;
  onUploadClick(id: string): void;
  onDeleteFile(id: string): void;
  onBulkDelete(ids: string[]): void;
}

export const TrackTable: React.FC<TrackTableProps> = ({
  data,
  sort,
  order,
  setSort,
  setOrder,
  page,
  totalPages,
  limit,
  setPage,
  setLimit,
  onEdit,
  onDelete,
  onUploadClick,
  onDeleteFile,
  onBulkDelete,
}) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sorting, setSorting] = useState<SortingState>([
    { id: sort, desc: order === "desc" },
  ]);

  useEffect(() => {
    const first = sorting[0];
    if (first && first.id !== "genres") {
      setSort(first.id as keyof Track);
      setOrder(first.desc ? "desc" : "asc");
    }
  }, [sorting, setSort, setOrder]);

  const toggleId = (id: string) =>
    setSelectedIds((prev) =>
      prev.has(id)
        ? new Set([...prev].filter((x) => x !== id))
        : new Set(prev).add(id)
    );

  const toggleAll = () => {
    const allVisibleIds = data.map((t) => t.id);
    setSelectedIds((prev) =>
      allVisibleIds.every((id) => prev.has(id))
        ? new Set()
        : new Set(allVisibleIds)
    );
  };

  const columns = useMemo(
    () =>
      getColumns(onEdit, onDelete, onUploadClick, onDeleteFile, {
        selectionMode,
        selectedIds,
        onToggleAll: toggleAll,
        onToggleId: toggleId,
      } as SelectionOptions),
    [onEdit, onDelete, onUploadClick, onDeleteFile, selectionMode, selectedIds]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    manualSorting: sorting[0]?.id !== "genres",
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <SelectModeToggle
        selectionMode={selectionMode}
        onToggleMode={() => {
          setSelectionMode((m) => !m);
          if (selectionMode) setSelectedIds(new Set());
        }}
        selectedCount={selectedIds.size}
        onBulkDelete={() => {
          onBulkDelete(Array.from(selectedIds));
          setSelectedIds(new Set());
        }}
        bulkDeleteDisabled={selectedIds.size === 0}
      />

      <div className="overflow-x-auto">
        <table className="table w-full table-auto mt-4">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                    style={{ width: header.column.columnDef.size }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <ChevronUp className="inline w-4 h-4 ml-1" />,
                      desc: <ChevronDown className="inline w-4 h-4 ml-1" />,
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
                  <td
                    key={cell.id}
                    style={{ width: cell.column.columnDef.size }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

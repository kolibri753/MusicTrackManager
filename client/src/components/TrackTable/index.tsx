import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import type { Track } from "@/types/track";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FilterSelect, Modal, SearchInput, TrackForm } from "@/components";
import { getColumns } from "./columns";
import { PaginationControls } from "./PaginationControls";
import { createTrack } from "@/api/tracks";

interface Props {
  data: Track[];
  genres: string[];
  artists: string[];
  refetch(): void;
  onEdit(id: string): void;
  onDelete(id: string): void;
  page: number;
  totalPages: number;
  limit: number;
  setPage(p: number): void;
  setLimit(l: number): void;
  sort: keyof Track;
  order: "asc" | "desc";
  setSort(f: keyof Track): void;
  setOrder(o: "asc" | "desc"): void;
  filterGenre: string;
  onFilterGenreChange(v: string): void;
  filterArtist: string;
  onFilterArtistChange(v: string): void;
  search: string;
  onSearchChange(v: string): void;
}

export const TrackTable: React.FC<Props> = ({
  data,
  genres,
  artists,
  refetch,
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
  filterGenre,
  onFilterGenreChange,
  filterArtist,
  onFilterArtistChange,
  search,
  onSearchChange,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  // — STATE —
  const [sorting, setSorting] = useState<SortingState>([
    { id: sort, desc: order === "desc" },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  // sync non‐genre sorts to server
  useEffect(() => {
    const first = sorting[0];
    if (first && first.id !== "genres") {
      setSort(first.id as keyof Track);
      setOrder(first.desc ? "desc" : "asc");
    }
  }, [sorting, setSort, setOrder]);

  // debounce search → globalFilter
  useEffect(() => {
    const h = setTimeout(() => setGlobalFilter(searchTerm), 300);
    return () => clearTimeout(h);
  }, [searchTerm]);

  // memo columns & distinct filter options
  const columns = useMemo(
    () => getColumns(onEdit, onDelete),
    [onEdit, onDelete]
  );
  // client-side sort only if sorting by "genres"
  const manualSorting = sorting[0]?.id !== "genres";

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    manualSorting,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <>
      {/* — Filters + Search — */}
      <div className="flex items-center justify-between mb-4">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search tracks…"
          dataTestId="search-input"
        />
        <div className="flex gap-4">
          <FilterSelect
            label="Artists"
            options={artists}
            value={filterArtist}
            dataTestId="filter-artist"
            onChange={onFilterArtistChange}
          />
          <FilterSelect
            label="Genres"
            options={genres}
            value={filterGenre}
            dataTestId="filter-genre"
            onChange={onFilterGenreChange}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tracks</h1>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          New Track
        </button>
      </div>

      {isAdding && (
        <Modal onClose={() => setIsAdding(false)}>
          <TrackForm
            onCancel={() => setIsAdding(false)}
            onSubmit={async (form) => {
              await createTrack(form);
              setIsAdding(false);
              refetch();
            }}
          />
        </Modal>
      )}

      {/* — Table — */}
      <table className="table w-full table-fixed">
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
                <td key={cell.id} style={{ width: cell.column.columnDef.size }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* — Pagination — */}
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

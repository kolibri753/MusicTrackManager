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
import { FilterSelect, SearchInput } from "@/components";
import { getColumns } from "./columns";
import { PaginationControls } from "./PaginationControls";

interface Props {
  data: Track[];
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
  const allGenres = useMemo(
    () => Array.from(new Set(data.flatMap((d) => d.genres))).sort(),
    [data]
  );
  const allArtists = useMemo(
    () => Array.from(new Set(data.map((d) => d.artist))).sort(),
    [data]
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
            label="Artist"
            options={allArtists}
            value={filterArtist}
            dataTestId="filter-artist"
            onChange={onFilterArtistChange}
          />
          <FilterSelect
            label="Genre"
            options={allGenres}
            value={filterGenre}
            dataTestId="filter-genre"
            onChange={onFilterGenreChange}
          />
        </div>
      </div>

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

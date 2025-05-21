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
import { Track } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FilterSelect, SearchInput, SelectModeToggle } from "@/components";
import { getColumns, SelectionOptions } from "./columns";
import { PaginationControls } from "./PaginationControls";

interface Props {
  data: Track[];
  genres: string[];
  artists: string[];
  genresLoading?: boolean;
  artistsLoading?: boolean;
  genresError?: boolean;
  artistsError?: boolean;
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
  onEdit(id: string): void;
  onDelete(id: string): void;
  onUploadClick(id: string): void;
  onDeleteFile(id: string): void;
  onBulkDelete(ids: string[]): void;
}

export const TrackTable: React.FC<Props> = ({
  data,
  genres,
  artists,
  genresLoading,
  artistsLoading,
  genresError,
  artistsError,
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => setSearchTerm(search), [search]);

  useEffect(() => {
    const first = sorting[0];
    if (first && first.id !== "genres") {
      setSort(first.id as keyof Track);
      setOrder(first.desc ? "desc" : "asc");
    }
  }, [sorting, setSort, setOrder]);

  const toggleId = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };
  const allVisibleIds = data.map((t) => t.id);
  const toggleAll = () =>
    setSelectedIds((prev) =>
      allVisibleIds.every((id) => prev.has(id))
        ? new Set()
        : new Set(allVisibleIds)
    );

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
    state: { sorting, columnFilters, globalFilter: searchTerm },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearchTerm,
    manualSorting: sorting[0]?.id !== "genres",
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
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
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search tracks…"
          dataTestId="search-input"
        />
        <div className="flex gap-4">
          <FilterSelect
            label="Artists"
            options={artists}
            value={filterArtist}
            loading={artistsLoading}
            error={artistsError}
            dataTestId="filter-artist"
            onChange={onFilterArtistChange}
          />
          <FilterSelect
            label="Genres"
            options={genres}
            value={filterGenre}
            loading={genresLoading}
            error={genresError}
            dataTestId="filter-genre"
            onChange={onFilterGenreChange}
          />
        </div>
      </div>

      <table className="table w-full table-auto">
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

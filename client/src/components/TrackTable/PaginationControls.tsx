// client/src/components/TrackTable/PaginationControls.tsx
import React from "react";
import type { Table } from "@tanstack/react-table";
import type { Track } from "@/types/track";

interface Props {
  table: Table<Track>;
}

export const PaginationControls: React.FC<Props> = ({ table }) => {
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        data-testid="pagination-prev"
        className="btn btn-sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        ← Prev
      </button>

      <span data-testid="pagination-info">
        Page {pageIndex + 1} of {table.getPageCount()}
      </span>

      <button
        data-testid="pagination-next"
        className="btn btn-sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next →
      </button>
      <select
        data-testid="limit-select"
        className="select select-bordered select-sm"
        value={pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
          table.setPageIndex(0);
        }}
      >
        {[5, 10, 20].map((n) => (
          <option key={n} value={n}>
            {n} / page
          </option>
        ))}
      </select>
    </div>
  );
};

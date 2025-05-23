import React from "react";

interface Props {
  page: number;
  totalPages: number;
  limit: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
}

export const PaginationControls: React.FC<Props> = ({
  page,
  totalPages,
  limit,
  setPage,
  setLimit,
}) => (
  <div
    className="flex items-center justify-end flex-wrap gap-4 mt-4"
    data-testid="pagination"
  >
    <button
      className="btn btn-sm"
      onClick={() => setPage(page - 1)}
      disabled={page <= 1}
      data-testid="pagination-prev"
    >
      ← Prev
    </button>

    <span>
      Page {page} of {totalPages}
    </span>

    <button
      className="btn btn-sm"
      onClick={() => setPage(page + 1)}
      disabled={page >= totalPages}
      data-testid="pagination-next"
    >
      Next →
    </button>

    <select
      className="select select-bordered select-sm"
      value={limit}
      onChange={(e) => {
        setLimit(Number(e.target.value));
        setPage(1);
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

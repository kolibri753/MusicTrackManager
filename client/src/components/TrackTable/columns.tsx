import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";
import type { Track } from "@/types/track";

export const getColumns = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<Track>[] => [
  { accessorKey: "title", header: "Title" },

  {
    accessorKey: "artist",
    header: "Artist",
    enableColumnFilter: true,
    filterFn: "includesString",
  },

  {
    accessorKey: "album",
    header: "Album",
    cell: (info) => info.getValue() ?? "—",
  },

  {
    accessorKey: "genres",
    header: "Genres",
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (a, b, id) => {
      const sa = (a.getValue<string[]>(id) ?? []).join(", ");
      const sb = (b.getValue<string[]>(id) ?? []).join(", ");
      return sa.localeCompare(sb);
    },
    filterFn: (row, id, filterValue: string) => {
      if (!filterValue) return true;
      return (row.getValue<string[]>(id) ?? []).includes(filterValue);
    },
    cell: (info) => (info.getValue<string[]>() ?? []).join(", "),
  },

  {
    id: "actions",
    header: "Actions",
    size: 50,
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          className="btn btn-xs btn-ghost"
          onClick={() => onEdit(row.original.id)}
        >
          <Edit2 size={14} />
        </button>
        <button
          className="btn btn-xs btn-error btn-outline"
          onClick={() => onDelete(row.original.id)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    ),
  },
];

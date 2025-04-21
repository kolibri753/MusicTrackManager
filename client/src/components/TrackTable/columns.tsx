// client/src/components/TrackTable/columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";
import type { Track } from "@/types/track";

export const getColumns = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<Track>[] => [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "artist", header: "Artist" },
  {
    accessorKey: "album",
    header: "Album",
    cell: (info) => info.getValue() ?? "—",
  },
  {
    accessorKey: "genres",
    header: "Genres",
    cell: (info) => (info.getValue() as string[]).join(", "),
  },
  {
    id: "actions",
    header: "Actions",
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

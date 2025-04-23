import { ColumnDef } from "@tanstack/react-table";
import BackupCoverUrl from "@/assets/logo.svg";
import { Edit2, Trash2, X } from "lucide-react";
import type { Track } from "@/types/track";

export const getColumns = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onUploadClick: (id: string) => void,
  onDeleteFile: (id: string) => void
): ColumnDef<Track>[] => [
  {
    accessorKey: "coverImage",
    header: "Cover",
    enableSorting: false,
    cell: ({ getValue }) => {
      const url = getValue<string>() || BackupCoverUrl;
      return (
        <img src={url} alt="cover" className="w-12 h-12 object-cover rounded" />
      );
    },
    size: 80,
  },

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
    id: "audio",
    header: "Audio",
    enableSorting: false,
    size: 300,
    cell: ({ row }) => {
      const { id, audioFile } = row.original;
      return audioFile ? (
        <div className="relative flex items-center gap-2">
          <audio
            controls
            src={`/api/files/${audioFile}`}
            className="w-full max-w-xs mr-2"
          />
          <button
            className="btn btn-xs btn-circle btn-error btn-ghost absolute top-0 right-0"
            onClick={() => onDeleteFile(id)}
          >
            <X size={12}/>
          </button>
        </div>
      ) : (
        <button className="btn btn-xs" onClick={() => onUploadClick(id)}>
          Upload
        </button>
      );
    },
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

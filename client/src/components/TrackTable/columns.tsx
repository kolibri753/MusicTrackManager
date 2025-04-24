import { ColumnDef } from "@tanstack/react-table";
import BackupCoverUrl from "@/assets/logo.svg";
import { Edit2, Trash2 } from "lucide-react";
import type { Track } from "@/types/track";
import { AudioPlayer } from "@/components";

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

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue, row }) => (
      <span data-testid={`track-item-${row.original.id}-title`}>
        {getValue<string>()}
      </span>
    ),
  },

  {
    accessorKey: "artist",
    header: "Artist",
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: ({ getValue, row }) => (
      <span data-testid={`track-item-${row.original.id}-artist`}>
        {getValue<string>()}
      </span>
    ),
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
        <AudioPlayer
          src={`/api/files/${audioFile}`}
          id={id}
          onRemove={() => onDeleteFile(id)}
        />
      ) : (
        <button
          className="btn btn-xs"
          onClick={() => onUploadClick(id)}
          data-testid={`upload-track-${id}`}
        >
          Upload
        </button>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    size: 50,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex gap-2">
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => onEdit(id)}
            data-testid={`edit-track-${id}`}
          >
            <Edit2 size={14} />
          </button>
          <button
            className="btn btn-xs btn-error btn-outline"
            onClick={() => onDelete(id)}
            data-testid={`delete-track-${id}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      );
    },
  },
];

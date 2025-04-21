import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useTracks, SortField, Order } from "@/hooks/useTracks";
import { Modal } from "@/components/Modal";
import { TrackForm } from "@/components/TrackForm";
import { getGenres } from "@/api/genres";

const TracksPage: React.FC = () => {
  const { tracks, meta, query, dispatch, add } = useTracks(10);
  const { sort, order, genre, artist, page } = query;

  const [showCreate, setShowCreate] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  const artists = useMemo(
    () => Array.from(new Set(tracks.map((t) => t.artist))),
    [tracks]
  );

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const [s, o] = e.target.value.split("_") as [SortField, Order];
    dispatch({ type: "SET_SORT", payload: s });
    dispatch({ type: "SET_ORDER", payload: o });
  };

  const handleGenreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_GENRE", payload: e.target.value });
  };

  const handleArtistChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_ARTIST", payload: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 data-testid="tracks-header" className="text-2xl font-semibold">
        Tracks
      </h1>

      <div className="flex flex-wrap gap-2 mt-4 items-center">
        <button
          data-testid="create-track-button"
          className="btn btn-primary"
          onClick={() => setShowCreate(true)}
        >
          New Track
        </button>

        <select
          data-testid="sort-select"
          className="select select-bordered"
          value={`${sort}_${order}`}
          onChange={handleSortChange}
        >
          <option value="title_asc">Title ↑</option>
          <option value="title_desc">Title ↓</option>
          <option value="artist_asc">Artist ↑</option>
          <option value="artist_desc">Artist ↓</option>
          <option value="album_asc">Album ↑</option>
          <option value="album_desc">Album ↓</option>
        </select>

        <select
          data-testid="filter-genre"
          className="select select-bordered"
          value={genre}
          onChange={handleGenreChange}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          data-testid="filter-artist"
          className="select select-bordered"
          value={artist}
          onChange={handleArtistChange}
        >
          <option value="">All Artists</option>
          {artists.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <table className="table w-full mt-6">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genres</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((t) => (
            <tr key={t.id} data-testid={`track-item-${t.id}`}>
              <td data-testid={`track-item-${t.id}-title`}>{t.title}</td>
              <td data-testid={`track-item-${t.id}-artist`}>{t.artist}</td>
              <td>{t.album || "—"}</td>
              <td>{t.genres.join(", ")}</td>
              <td className="flex gap-2">
                <button
                  data-testid={`edit-track-${t.id}`}
                  className="btn btn-sm btn-ghost"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  data-testid={`delete-track-${t.id}`}
                  className="btn btn-sm btn-error btn-outline"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        data-testid="pagination"
        className="flex justify-center items-center gap-4 mt-4"
      >
        <button
          data-testid="pagination-prev"
          className="btn btn-sm"
          disabled={page <= 1}
          onClick={() => dispatch({ type: "SET_PAGE", payload: page - 1 })}
        >
          ← Prev
        </button>

        <span>
          Page {page} of {meta.totalPages}
        </span>

        <button
          data-testid="pagination-next"
          className="btn btn-sm"
          disabled={page >= meta.totalPages}
          onClick={() => dispatch({ type: "SET_PAGE", payload: page + 1 })}
        >
          Next →
        </button>
      </div>

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <TrackForm
            onCancel={() => setShowCreate(false)}
            onSubmit={async (data) => {
              await add(data);
              setShowCreate(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default TracksPage;

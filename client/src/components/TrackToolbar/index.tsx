import React from "react";
import { FilterSelect, SearchInput } from "@/components";

export interface TrackToolbarProps {
  artists: { list: string[]; loading: boolean; error: boolean };
  genres: { list: string[]; loading: boolean; error: boolean };

  filterArtist: string;
  setFilterArtist(v: string): void;

  filterGenre: string;
  setFilterGenre(v: string): void;

  search: string;
  setSearch(v: string): void;
}

export const TrackToolbar: React.FC<TrackToolbarProps> = ({
  artists,
  genres,
  filterArtist,
  setFilterArtist,
  filterGenre,
  setFilterGenre,
  search,
  setSearch,
}) => (
  <div className="flex items-center justify-between flex-wrap mb-4">
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder="Search tracks…"
      dataTestId="search-input"
    />

    <div className="flex gap-4">
      <FilterSelect
        label="Artists"
        options={artists.list}
        value={filterArtist}
        loading={artists.loading}
        error={artists.error}
        dataTestId="filter-artist"
        onChange={setFilterArtist}
      />
      <FilterSelect
        label="Genres"
        options={genres.list}
        value={filterGenre}
        loading={genres.loading}
        error={genres.error}
        dataTestId="filter-genre"
        onChange={setFilterGenre}
      />
    </div>
  </div>
);

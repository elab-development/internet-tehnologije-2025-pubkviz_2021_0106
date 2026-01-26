"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const GENRES = ["opsti", "filmski", "sportski", "muzicki"];

type Props = {
  onFiltersChange: (search: string, zanr: string) => void;
};


export default function Sidebar({ onFiltersChange }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedZanr, setSelectedZanr] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFiltersChange(value, selectedZanr);
  };

  const handleGenreChange = (value: string) => {
    setSelectedZanr(value);
    onFiltersChange(searchInput, value);
  };

  return (
    <aside className="w-64 p-4 border-r space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search quizzes..."
        value={searchInput}
        onChange={e => handleSearchChange(e.target.value)}
        className="w-full border rounded p-2"
      />

      {/* Genres */}
      <div>
        <h3 className="font-semibold mb-2">Genres</h3>
        {GENRES.map(g => (
          <label key={g} className="flex items-center gap-2">
            <input
              type="radio"
              name="zanr"
              checked={selectedZanr === g}
              onChange={() => handleGenreChange(g)}
            />
            {g}
          </label>
        ))}

        {/* Clear genre */}
        {selectedZanr && (
          <button
            onClick={() => handleGenreChange("")}
            className="text-sm text-blue-500 mt-2"
          >
            Clear genre
          </button>
        )}
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";

const GENRES = ["opsti", "filmski", "sportski", "muzicki"];
const MESTA = ["Beograd", "Nis", "Novi Sad", "Ostalo"];

type Props = {
  onFiltersChange: (search: string, zanr: string, mesto: string) => void;
  onAISearch: () => void;
};

export default function Sidebar({ onFiltersChange, onAISearch }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedZanr, setSelectedZanr] = useState("");
  const [selectedMesto, setSelectedMesto] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFiltersChange(value, selectedZanr, selectedMesto);
  };

  const handleGenreChange = (value: string) => {
    setSelectedZanr(value);
    onFiltersChange(searchInput, value, selectedMesto);
  };

  const handleMestoChange = (value: string) => {
    setSelectedMesto(value);
    onFiltersChange(searchInput, selectedZanr, value);
  };

  return (
    <aside className="w-64 p-4 border-r space-y-4">
      <input
        type="text"
        placeholder="Pretrazite kvizove..."
        value={searchInput}
        onChange={(e) => handleSearchChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onAISearch();
          }
        }}
        className="w-full border rounded p-2"
      />

      <div>
        <h3 className="font-semibold mb-2">Zanrovi</h3>

        {GENRES.map((g) => (
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

        {selectedZanr && (
          <button
            onClick={() => handleGenreChange("")}
            className="text-sm text-blue-500 mt-2"
          >
            Ukloni filter
          </button>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Mesta</h3>

        {MESTA.map((m) => (
          <label key={m} className="flex items-center gap-2">
            <input
              type="radio"
              name="mesto"
              checked={selectedMesto === m}
              onChange={() => handleMestoChange(m)}
            />
            {m}
          </label>
        ))}

        {selectedMesto && (
          <button
            onClick={() => handleMestoChange("")}
            className="text-sm text-blue-500 mt-2"
          >
            Ukloni filter
          </button>
        )}
      </div>
    </aside>
  );
}
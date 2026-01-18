"use client";

import { useRouter, useSearchParams } from "next/navigation";

const GENRES = [
    { id: "opsti", label: "Opsti" },
  { id: "sportski", label: "Sportski" },
  { id: "istorija", label: "Istorija" },
  { id: "muzicki", label: "Muzicki" },
  
];

export default function Sidebar() {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get("search") ?? "";
  const genres = params.get("genres")?.split(",") ?? [];

  const updateParams = (newSearch: string, newGenres: string[]) => {
    const sp = new URLSearchParams();
    if (newSearch) sp.set("search", newSearch);
    if (newGenres.length) sp.set("genres", newGenres.join(","));
    router.push(`/?${sp.toString()}`);
  };

  // Now render JSX for input + checkboxes
  return (
    <aside className="w-62.5 p-4 border-r border-gray-300">
      <input
        type="text"
        placeholder="Pretrazite kvizove..."
        value={search}
        onChange={e => updateParams(e.target.value, genres)}
        className="w-full p-2 border rounded mb-4"
      />

      <div>
        <strong>Zanrovi</strong>
        {GENRES.map(g => (
          <label key={g.id} className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={genres.includes(g.id)}
              onChange={() => {
                const newGenres = genres.includes(g.id)
                  ? genres.filter(id => id !== g.id)
                  : [...genres, g.id];
                updateParams(search, newGenres);
              }}
            />
            {g.label}
          </label>
        ))}
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useState } from "react";

type Row = {
  [key: string]: string;
};

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [seasonFilter, setSeasonFilter] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_SHEETDB_URL!);
        const data = await res.json();
        console.log("SheetDB data:", data);
        setRows(data);
      } catch (err) {
        console.error("Greška pri fetch-u SheetDB:", err);
      }
    };
    fetchData();
  }, []);

  
  useEffect(() => {
    setSortDirection(null);
  }, [seasonFilter]);

 
  const filtered = seasonFilter
    ? rows.filter(
        r => r["Season"] === seasonFilter || r["Sezona"] === seasonFilter
      )
    : rows;

  
  const sorted = [...filtered];

  if (sortDirection) {
    sorted.sort((a, b) => {
      const aVal = Number(a["Rezultat"] ?? 0);
      const bVal = Number(b["Rezultat"] ?? 0);

      return sortDirection === "asc"
        ? aVal - bVal
        : bVal - aVal;
    });
  }

  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div className="p-4 border rounded mt-8">
      <h2 className="text-xl font-bold mb-2">Tabela</h2>

      <label className="mr-2">Filtriraj po sezoni:</label>
      <select
        value={seasonFilter}
        onChange={e => setSeasonFilter(e.target.value)}
        className="border p-1"
      >
        <option value="">Sve sezone</option>
        <option value="23/24">23/24</option>
        <option value="24/25">24/25</option>
        <option value="25/26">25/26</option>
      </select>

      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col}
                className={`border p-2 ${
                  col === "Rezultat" ? "cursor-pointer select-none" : ""
                }`}
                onClick={() => {
                  if (col === "Rezultat") {
                    setSortDirection(prev =>
                      prev === "asc" ? "desc" : "asc"
                    );
                  }
                }}
              >
                {col}
                {col === "Rezultat" && sortDirection && (
                  sortDirection === "asc" ? " ▲" : " ▼"
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col} className="border p-2">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
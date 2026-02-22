"use client";

import { useEffect, useState } from "react";

// Tipovi podataka koje vraća tvoj SheetDB
type Row = {
  [key: string]: string; // fleksibilno da radi sa bilo kojim nazivom kolona
};

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [seasonFilter, setSeasonFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_SHEETDB_URL!);
        const data = await res.json();
        console.log("SheetDB data:", data); // ovo ti pokazuje JSON i ključeve
        setRows(data);
      } catch (err) {
        console.error("Greška pri fetch-u SheetDB:", err);
      }
    };
    fetchData();
  }, []);

  // Ako je filter po sezoni postavljen
  const filtered = seasonFilter
    ? rows.filter(r => r["Season"] === seasonFilter || r["Sezona"] === seasonFilter)
    : rows;

  // Odredi ključeve za kolone automatski (uzimamo iz prvog reda)
  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div className="p-4 border rounded mt-8">
      <h2 className="text-xl font-bold mb-2">Tabela</h2>

      <label className="mr-2">Filtriraj po sezoni:</label>
      <select value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)}>
        <option value="">Sve sezone</option>
        <option value="23/24">23/24</option>
        <option value="24/25">24/25</option>
        <option value="25/26">25/26</option>
      </select>

      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} className="border p-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col} className="border p-2">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
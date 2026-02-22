"use client";
export const dynamic = "force-dynamic";

import Sidebar from "./components/Sidebar";
import QuizCard from "./components/QuizCard"; 
import Kalendar from "./components/Kalendar"; // poboljšani kalendar
import Leaderboard from "./components/Leaderboard"; // SheetDB leaderboard
import KvizChart from "./components/KvizChart"; // nova komponenta za Google Charts
import { useEffect, useState } from "react";

export default function QuizListPage() {
  const [search, setSearch] = useState("");
  const [zanr, setZanr] = useState("");
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const fetchQuizzes = async () => {
    let url = `/api/quizzes?`;
    if (search) url += `search=${search}&`;
    if (zanr) url += `zanr=${zanr}&`;

    const res = await fetch(url);
    const data = await res.json();
    setQuizzes(data);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [search, zanr]);

  return (
    <>
      {/* Sidebar sa filterima */}
      <Sidebar onFiltersChange={(s, z) => { setSearch(s); setZanr(z); }} />

      <main className="flex-1 p-4 space-y-8">
        {/* Lista kvizova */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {quizzes.map(q => (
            <QuizCard key={q.id} quiz={q} />
          ))}
        </div>

        {/* Kalendar sa budućim događajima */}
        <Kalendar />

        {/* Grafik: broj kvizova po mesecima */}
        <KvizChart />

        {/* Leaderboard iz SheetDB */}
        <Leaderboard />
      </main>
    </>
  );
}
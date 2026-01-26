"use client";

export const dynamic = "force-dynamic";


import Image from "next/image";
import Sidebar from "./components/Sidebar";
import QuizList from "./components/QuizList";
import Sidebar2 from "./components/Sidebar2";
import QuizCard from "./components/QuizCard";
import { db } from "@/db";
import { kvizovi } from "@/db/schema";
import { and, eq, ilike } from "drizzle-orm";
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
      <Sidebar onFiltersChange={(s, z) => { setSearch(s); setZanr(z); }} />
    <main className="flex-1 p-4">
       {/*<QuizList />*/}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {quizzes.map(q => (
        <QuizCard key={q.id} quiz={q} />
      ))}

      
    </div>
    
    </main>
      <Sidebar2 />
    
    </>
  );
}


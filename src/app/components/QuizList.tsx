
"use client";


import { db } from "@/db";
import { kvizovi } from "@/db/schema";
import { useSearchParams } from "next/navigation";

const quizzes1 = [
  {
    id: 1,
    title: "Opsti kviz Oktopab 12/1/2026",
    genres: ["opsti", "istorija"],
  },
  {
    id: 2,
    title: "Sportski kviz",
    genres: ["sportski"],
  },
];

const quizzes = (await db.select().from(kvizovi)).map(q => ({
    id: q.id, // UUID → string
    title: q.title,
    description: q.description ?? "",
    date: q.createdAt
      ? q.createdAt.toLocaleDateString()
      : "Unknown date",
     genres: q.zanr, 
  }));

export default function QuizList() {
  const params = useSearchParams();
  const search = params.get("search")?.toLowerCase() ?? "";
  const genres = params.get("genres")?.split(",") ?? [];

  const filtered = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search);
    const matchesGenre =
      genres.length === 0 ||
      genres.some(g => q.genres.includes(g));

    return matchesSearch && matchesGenre;
  });

  return (
    <div>
      {filtered.map(q => (
        <div key={q.id}>{q.title}</div>
      ))}
    </div>
  );
}

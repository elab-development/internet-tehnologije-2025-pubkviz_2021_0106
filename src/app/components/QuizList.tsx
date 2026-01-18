"use client";


import { useSearchParams } from "next/navigation";

const quizzes = [
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

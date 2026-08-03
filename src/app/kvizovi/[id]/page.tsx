

import { db } from "@/db";
import { kvizovi, pitanje } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditButton from "@/app/components/EditButton";

type QuizRecommendation = {
  id: string;
  title: string;
  description: string | null;
  mesto: string | null;
  adresa: string | null;
};

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>; // params is now a Promise
}) {
  const { id } = await params; // unwrap the Promise

  
 
     const quiz = await db.query.kvizovi.findFirst({
    where: eq(kvizovi.id, id),
  });

  if (!quiz) notFound();

  const pitanja = await db
    .select()
    .from(pitanje)
    .where(eq(pitanje.idKviza, quiz.id));
    const otherQuizzes = await db.query.kvizovi.findMany({
  where: ne(kvizovi.id, quiz.id),
});

const response = await fetch(
  "http://localhost:3000/api/ai/recommended",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quizId: quiz.id,
    }),
    cache: "no-store",
  }
);

const data = await response.json();

const recommendedQuizzes = data.quizzes;

  return (
    
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex gap-50">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <EditButton quizId={quiz.id}></EditButton>
      </div>
      
      <p className="mt-2">{quiz.description}</p>
      <p className="mt-1 text-gray-500">
        Napravljeno: {quiz.createdAt?.toLocaleDateString()}
      </p>
      
      {/* samo pitanja za taj kviz */}
        {pitanja.map((p) => (  //p.idKviza===quiz.id ? (
    <div key={p.id}>
      <p className="p-5">{p.id}. {p.pitanje}</p>
      <div className="text-amber-400 bg-amber-400 hover:bg-blue-700 ">
            <p className="p-5">{p.odgovor}</p>
      </div>
      
    </div> //) : "Greska"
            ))} 
      
          <div className="mt-6">
  <h2 className="text-xl font-semibold mb-3">
    Lokacija kviza
  </h2>

  <iframe
    className="w-full h-80 rounded-xl shadow"
    loading="lazy"
    allowFullScreen
    src={`https://www.google.com/maps?q=${encodeURIComponent(
      `${quiz.adresa}, ${quiz.mesto}`
    )}&output=embed`}
  />

  <a
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${quiz.adresa}, ${quiz.mesto}`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-3 text-blue-600 hover:underline"
  >
    📍 Otvori u Google Maps
  </a>
</div>
<div className="mt-10">
  <h2 className="text-2xl font-bold mb-5">
    Preporučeni kvizovi
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {recommendedQuizzes.map((recommendedQuiz: QuizRecommendation) => (
      <div
        key={recommendedQuiz.id}
        className="border rounded-xl p-5 shadow hover:shadow-lg transition"
      >
        <h3 className="text-xl font-semibold">
          {recommendedQuiz.title}
        </h3>

        <p className="mt-2 text-gray-700">
          {recommendedQuiz.description}
        </p>

        <div className="mt-4 text-sm text-gray-500">
          <p>
            <span className="font-medium">📍 Mesto:</span>{" "}
            {recommendedQuiz.mesto}
          </p>

          <p>
            <span className="font-medium">🏠 Adresa:</span>{" "}
            {recommendedQuiz.adresa}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
    </div>

    
  );
}

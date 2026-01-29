

import { db } from "@/db";
import { kvizovi, pitanje } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditButton from "@/app/components/EditButton";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>; // params is now a Promise
}) {
  const { id } = await params; // unwrap the Promise

  {/*const result = await db
    .select()
    .from(kvizovi)
    .where(eq(kvizovi.id, id))
    .limit(1);

  const quiz = result[0];

  if (!quiz) {
    notFound(); 
  }

  const pitanja = await db
    .select().from(pitanje);*/}
     const quiz = await db.query.kvizovi.findFirst({
    where: eq(kvizovi.id, id),
  });

  if (!quiz) notFound();

  const pitanja = await db
    .select()
    .from(pitanje)
    .where(eq(pitanje.idKviza, quiz.id));



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
      <p className="p-5">{p.id-1}. {p.pitanje}</p>
      <div className="text-amber-400 bg-amber-400 hover:bg-blue-700 ">
            <p className="p-5">{p.odgovor}</p>
      </div>
      
    </div> //) : "Greska"
            ))} 
      
          
    </div>
  );
}

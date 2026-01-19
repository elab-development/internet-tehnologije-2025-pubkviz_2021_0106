import { db } from "@/db";
import { kvizovi } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>; // params is now a Promise
}) {
  const { id } = await params; // unwrap the Promise

  const result = await db
    .select()
    .from(kvizovi)
    .where(eq(kvizovi.id, id))
    .limit(1);

  const quiz = result[0];

  if (!quiz) {
    notFound(); // 404 fallback
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      <p className="mt-2">{quiz.description}</p>
      <p className="mt-1 text-gray-500">
        Created at: {quiz.createdAt?.toLocaleDateString()}
      </p>
    </div>
  );
}

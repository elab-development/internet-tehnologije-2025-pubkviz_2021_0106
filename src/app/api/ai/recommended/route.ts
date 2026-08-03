import OpenAI from "openai";
import { db } from "@/db";
import { kvizovi } from "@/db/schema";
import { eq, ne } from "drizzle-orm";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();

  const quiz = await db.query.kvizovi.findFirst({
    where: eq(kvizovi.id, body.quizId),
  });

  if (!quiz) {
    return Response.json(
      { success: false, error: "Quiz not found" },
      { status: 404 }
    );
  }

  const otherQuizzes = await db.query.kvizovi.findMany({
    where: ne(kvizovi.id, quiz.id),
  });

  const response = await client.responses.create({
    model: "gpt-5.4",
    input: `
Trenutni kviz:

Naslov: ${quiz.title}
Opis: ${quiz.description}
Žanr: ${quiz.zanr}
Mesto: ${quiz.mesto}

Ostali kvizovi:

${otherQuizzes
  .map(
    (q, index) => `
${index + 1}.
Naslov: ${q.title}
Opis: ${q.description}
Žanr: ${q.zanr}
Mesto: ${q.mesto}
`
  )
  .join("\n")}

Izaberi DVA kviza koja su najsličnija trenutnom.

Posmatraj naslov, opis i žanr zajedno.

Vrati ISKLJUČIVO validan JSON.

Format mora biti TAČNO ovakav:

{
  "recommendedIndexes": [2,5]
}

Bez markdown-a.
Bez objašnjenja.
Bez dodatnog teksta.
`,
  });

  console.log(response.output_text);

  const result = JSON.parse(response.output_text);

  const recommendedQuizzes = result.recommendedIndexes
    .map((index: number) => otherQuizzes[index - 1])
    .filter(Boolean);

  return Response.json({
    success: true,
    quizzes: recommendedQuizzes,
  });
}
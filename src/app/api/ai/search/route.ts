import OpenAI from "openai";
import { db } from "@/db";
import { kvizovi } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();

  const search = body.search ?? "";
  const zanr = body.zanr ?? "";
  const mesto = body.mesto ?? "";

  const conditions = [];

  if (zanr) {
    conditions.push(eq(kvizovi.zanr, zanr));
  }

  if (mesto) {
    conditions.push(eq(kvizovi.mesto, mesto));
  }

  const quizzes = await db
    .select({
      id: kvizovi.id,
      title: kvizovi.title,
      description: kvizovi.description,
      zanr: kvizovi.zanr,
      mesto: kvizovi.mesto,
    })
    .from(kvizovi)
    .where(conditions.length ? and(...conditions) : undefined);


  const response = await client.responses.create({
    model: "gpt-5.4",
    input: `
Korisnik pretražuje pub kvizove.

Upit korisnika:
"${search}"

Dostupni kvizovi:

${quizzes
  .map(
    (q) => `
ID: ${q.id}
Naslov: ${q.title}
Opis: ${q.description ?? ""}
Žanr: ${q.zanr}
Mesto: ${q.mesto ?? ""}
`
  )
  .join("\n")}


Pronađi najrelevantnije kvizove za korisnički upit.

Posmatraj:
- značenje upita
- naslov
- opis
- žanr
- mesto

Vrati ISKLJUČIVO validan JSON.

Format mora biti TAČNO:

{
  "recommendedIds": [
    "id1",
    "id2"
  ]
}

Pravila:
- Vrati samo ID-jeve kvizova koji postoje u listi.
- Ne izmišljaj nove kvizove.
- Možeš vratiti više rezultata.
- Prvo navedi najrelevantnije rezultate.
- Ako nema odgovarajućih rezultata, vrati prazan niz.

Bez markdown-a.
Bez objašnjenja.
Bez dodatnog teksta.
`,
  });


  const result = JSON.parse(response.output_text);


  const recommendedQuizzes = result.recommendedIds
    .map((id: string) =>
      quizzes.find((q) => q.id === id)
    )
    .filter(Boolean);


  return Response.json(recommendedQuizzes);
}
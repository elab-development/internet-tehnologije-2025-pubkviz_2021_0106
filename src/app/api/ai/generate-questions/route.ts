import OpenAI from "openai";
import { db } from "@/db";
import { pitanje } from "@/db/schema";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const body = await req.json();
    const response = await client.responses.create({
  model: "gpt-4.1-mini",
  input: `
Generiši ${body.brojPitanja} pitanja za pub kviz.

Tema/oblast: ${body.tema}

Težina: ${body.tezina}

Vrati ISKLJUČIVO validan JSON niz.
Bez markdown-a.
Bez dodatnog teksta.

Format mora biti tačno ovakav:

[
  {
    "pitanje": "tekst pitanja",
    "odgovor": "tačan odgovor",
    "oblast": "${body.tema}",
    "poeni": broj
  }
]

Pravila za poene:
- Lako = 1
- Srednje = 2
- Teško = 3

Sva pitanja moraju biti iz zadate oblasti.
`,
});

const pitanja = JSON.parse(response.output_text);

console.log(response.output_text);

    console.log(body);
    
await db.insert(pitanje).values(
  pitanja.map((p: any) => ({
    pitanje: p.pitanje,
    odgovor: p.odgovor,
    oblast: p.oblast,
    poeni: p.poeni,
    idKviza: body.quizId,
  }))
);
    return Response.json({
  success: true,
  text: response.output_text,
});
}
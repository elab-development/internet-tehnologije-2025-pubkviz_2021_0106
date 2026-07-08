import OpenAI from "openai";
import { db } from "@/db";
import { pitanje } from "@/db/schema";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const body = await req.json();
    const response = await client.responses.create({
  model: "gpt-5.4",
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
Pitanja piši na prirodnom i književnom srpskom jeziku.

Nemoj koristiti bukvalne prevode sa engleskog.

Nemoj koristiti komplikovane ili predugačke rečenice.

Pitanja treba da zvuče kao da ih je sastavio iskusan autor pub kvizova.

Izbegavaj umetnuta objašnjenja u zagradama.

Svako pitanje treba da bude jasno i da ima jedan nedvosmislen tačan odgovor.
Odgovor ne sme biti sugerisan tekstom pitanja.
Odgovor može sadržati najmanje jednu, a najviše deset recči.
Mora postojati jasna razlika između različitih nivoa težine, gde na teška pitanja prosečan kvizaš ne bi mogao da odgovori.


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
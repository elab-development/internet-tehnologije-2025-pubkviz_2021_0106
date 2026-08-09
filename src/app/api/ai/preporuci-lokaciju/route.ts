import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cirilicaULatinicu(text: string) {
  const mapa: Record<string, string> = {
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Ђ: "Đ",
    Е: "E",
    Ж: "Ž",
    З: "Z",
    И: "I",
    Ј: "J",
    К: "K",
    Л: "L",
    Љ: "Lj",
    М: "M",
    Н: "N",
    Њ: "Nj",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    Ћ: "Ć",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "C",
    Ч: "Č",
    Џ: "Dž",
    Ш: "Š",

    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    ђ: "đ",
    е: "e",
    ж: "ž",
    з: "z",
    и: "i",
    ј: "j",
    к: "k",
    л: "l",
    љ: "lj",
    м: "m",
    н: "n",
    њ: "nj",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    ћ: "ć",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "č",
    џ: "dž",
    ш: "š",
  };

  return text
    .split("")
    .map((char) => mapa[char] ?? char)
    .join("");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { mesto, brojTimova } = body;

    if (!mesto || !brojTimova) {
      return Response.json(
        { error: "Grad i broj timova su obavezni." },
        { status: 400 }
      );
    }

    const minPeople = brojTimova * 3;
    const maxPeople = brojTimova * 6;

    const nominatimResponse = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&city=${encodeURIComponent(
    mesto
  )}&country=Serbia&limit=1`,
  {
    headers: {
      "User-Agent": "PubKviz/1.0",
    },
  }
);

if (!nominatimResponse.ok) {
  throw new Error("Greška prilikom komunikacije sa Nominatim API-jem.");
}

const nominatimData = await nominatimResponse.json();

if (!nominatimData.length) {
  return Response.json(
    {
      error: `Grad "${mesto}" nije pronađen.`,
    },
    { status: 404 }
  );
}

const city = nominatimData[0];

console.log("NOMINATIM:", city);

    // 1. Pronađi stvarne lokale preko OpenStreetMap / Overpass API-ja
   const [south, north, west, east] = city.boundingbox;

const overpassQuery = `
  [out:json][timeout:15];

  (
    nwr["amenity"="pub"](${south},${west},${north},${east});
    nwr["amenity"="bar"](${south},${west},${north},${east});
    nwr["amenity"="cafe"](${south},${west},${north},${east});
  );

  out center;
`;

   const overpassResponse = await fetch(
  "https://overpass-api.de/api/interpreter",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "PubKviz/1.0",
    },
    body: new URLSearchParams({
      data: overpassQuery,
    }).toString(),
  }
);

   if (!overpassResponse.ok) {
  const errorText = await overpassResponse.text();

  console.error("OVERPASS STATUS:", overpassResponse.status);
  console.error("OVERPASS ERROR:", errorText);

  throw new Error(
    `Overpass greška ${overpassResponse.status}: ${errorText}`
  );
}

    const overpassData = await overpassResponse.json();
console.log(
  "OVERPASS REZULTATI:",
  JSON.stringify(overpassData.elements.slice(0, 20), null, 2)
);
    const places = overpassData.elements
  .filter((place: any) => place.tags?.name)
  .map((place: any) => ({
    naziv: cirilicaULatinicu(place.tags.name),
    adresa: cirilicaULatinicu(
      [
        place.tags["addr:street"],
        place.tags["addr:housenumber"],
      ]
        .filter(Boolean)
        .join(" ")
    ),
    tip: place.tags.amenity,
  }))
  .filter((place: any) => place.adresa);

console.log("LOKALI:", places);

    if (places.length === 0) {
      return Response.json(
        {
          error: "Nisu pronađeni lokali sa dostupnom adresom u ovom gradu.",
        },
        { status: 404 }
      );
    }

    // Ograničimo broj rezultata koje šaljemo OpenAI-ju
    const ograniceniLokali = places.slice(0, 50);

    // 2. OpenAI bira najpogodniji lokal
    const response = await client.responses.create({
      model: "gpt-5.4",
      input: `
Ti preporučuješ lokaciju za održavanje pub kviza.

Grad: ${mesto}

Očekivani broj timova: ${brojTimova}

Svaki tim ima između 3 i 6 članova.

Očekivani broj učesnika:
${minPeople}–${maxPeople}

Ispod se nalazi lista STVARNIH lokala pronađenih iz OpenStreetMap baze.

Tvoj zadatak je da izabereš najpogodniji lokal za pub kviz.

Prioritet imaju:
- pubovi i barovi
- zatim kafići i restorani
- lokali koji deluju pogodno za grupno okupljanje
- lokali koji su prikladni za očekivani broj učesnika

VEOMA VAŽNA PRAVILA:

- Smeš da izabereš ISKLJUČIVO lokal koji se nalazi na listi.
- Ne smeš da izmišljaš lokal.
- Ne smeš da izmišljaš adresu.
- Ne smeš da menjaš naziv ili adresu lokala.
- Ne smeš da kombinuješ naziv jednog lokala sa adresom drugog.
- Ako nema dovoljno podataka za sigurnu preporuku, ipak izaberi najrazumniji lokal sa liste.

Lokali:

${JSON.stringify(ograniceniLokali, null, 2)}

Vrati ISKLJUČIVO validan JSON objekat.
Bez markdown-a.
Bez dodatnog teksta.

Format:

{
  "naziv": "tačan naziv sa liste",
  "adresa": "tačna adresa sa liste",
  "obrazlozenje": "kratko objašnjenje zašto je ovaj lokal najpogodniji"
}
`,
    });

    const preporuka = JSON.parse(response.output_text);

    return Response.json({
      success: true,
      preporuka,
    });
  } catch (error) {
  console.error("PREPORUKA LOKACIJE ERROR:", error);

  return Response.json(
    {
      error:
        error instanceof Error
          ? error.message
          : "Nepoznata greška",
    },
    { status: 500 }
  );
}}
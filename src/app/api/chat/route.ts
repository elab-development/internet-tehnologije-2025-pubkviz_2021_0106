import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  const response = await client.responses.create({
    model: "gpt-5",
    input: "Reci zdravo na srpskom u jednoj rečenici.",
  });

  return Response.json({
    text: response.output_text,
  });
}
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  const response = await openai.responses.create({
    model: "gpt-5.5-mini",
    input: "Write a haiku about AI.",
  });

  return NextResponse.json({
    text: response.output_text,
  });
}
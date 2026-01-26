import { NextResponse } from "next/server";
import { db } from "@/db";
import { kvizovi } from "@/db/schema";
import { ilike, eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const zanr = searchParams.get("zanr") ?? "";

  const conditions = [];
  if (search) conditions.push(ilike(kvizovi.title, `%${search}%`));
  if (zanr) conditions.push(eq(kvizovi.zanr, zanr));

  const quizzesDB = await db
    .select()
    .from(kvizovi)
    .where(conditions.length ? and(...conditions) : undefined);

  const quizzes = quizzesDB.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description ?? "",
    date: q.createdAt ? q.createdAt.toLocaleDateString() : "Unknown date",
    zanr: q.zanr,
  }));

  return NextResponse.json(quizzes);
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { kvizovi } from "@/db/schema";
import { ilike, eq, and, or, not, inArray } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const zanr = searchParams.get("zanr") ?? "";
  const mesto = searchParams.get("mesto") ?? "";

  const conditions = [];
  if (search) {conditions.push( or(
        ilike(kvizovi.title, `%${search}%`),
        ilike(kvizovi.mesto, `%${search}%`)
      ));}
if (zanr) {
    conditions.push(eq(kvizovi.zanr, zanr));
  }
  if (mesto) {
    if (mesto === "Ostalo") {conditions.push(not(
          inArray(kvizovi.mesto, ["Beograd", "Nis", "Novi Sad"])
        )    );  } else {
      conditions.push(eq(kvizovi.mesto, mesto));
    }
  }
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
    mesto: q.mesto,
  }));
  return NextResponse.json(quizzes);}
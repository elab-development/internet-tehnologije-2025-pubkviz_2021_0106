import { db } from "@/db";
import { ekipaClanovi } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ ekipaId: string }> }
) {
  const { ekipaId } = await context.params; // ✅ uzimamo samo string

  const { userId } = await req.json();

  await db.insert(ekipaClanovi).values({
    ekipaId: Number(ekipaId), // ✅ konverzija u number
    userId,
  });

  return NextResponse.json({ ok: true });
}
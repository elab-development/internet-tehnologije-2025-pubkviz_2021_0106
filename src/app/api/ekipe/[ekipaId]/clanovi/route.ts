import { db } from "@/db";
import { ekipaClanovi } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { ekipaId: string } }
) {
  const ekipaId = Number(params.ekipaId); // ⬅️ iz URL-a

  const { userId } = await req.json();

  await db.insert(ekipaClanovi).values({
    ekipaId,
    userId,
  });

  return NextResponse.json({ ok: true });
}

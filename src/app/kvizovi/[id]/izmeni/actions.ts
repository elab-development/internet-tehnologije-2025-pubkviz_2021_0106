"use server";

import { db } from "@/db";
import { kvizovi, pitanje } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export async function addPitanje(formData: FormData) {
  const user = await getCurrentUser();
    
  if (!user || (user.role !== "Administrator" && user.role !== "Organizator")) {
    notFound();
  }

  const quizId = formData.get("quizId") as string;
  
  const tekst = formData.get("tekst") as string;
  const odgovor = formData.get("odgovor") as string;
  const oblast = formData.get("oblast") as string;
  const poeni = Number(formData.get("poeni"));

  if (!quizId || !tekst || !odgovor || !poeni) {
    throw new Error("Nedostaju podaci");
  }

  await db.insert(pitanje).values({
    idKviza: quizId,
    pitanje: tekst,
    odgovor,
    oblast,
    poeni,
  });

  redirect(`/kvizovi/${quizId}`);
}
"use server";

import { db } from "@/db";
import { kvizovi, pitanje } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
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

export async function obrisiPitanje(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || (user.role!="Administrator" && user.role!="Organizator")){
    notFound();
  }

  const pitanjeIdRaw = formData.get("pitanjeId");
if (!pitanjeIdRaw) throw new Error("Fali pitanjeId");

  const pitanjeId = Number(pitanjeIdRaw);
  const quizId = formData.get("quizId") as string;

   if (!pitanjeId || !quizId) {
    throw new Error("Fale podaci");
  }

   await db
    .delete(pitanje)
    .where(and(eq(pitanje.id, pitanjeId), eq(pitanje.idKviza, quizId) )// dodatna sigurnost
      
    );
    redirect(`/kvizovi/${quizId}`);
} //&& user.role!="Organizator"

export async function izmeniPitanje(formData:FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role!="Administrator" )){
    notFound();
  }

  const pitanjeIdRaw = formData.get("pitanjeId");
  const quizId = formData.get("quizId") as string;
if (!pitanjeIdRaw || !quizId)   throw new Error("Fali pitanjeId");

  const pitanjeId = Number(pitanjeIdRaw);
  

   const tekst = formData.get("tekst") as string;
  const odgovor = formData.get("odgovor") as string;
  const oblast = formData.get("oblast") as string;
  const poeni = Number(formData.get("poeni"));

  await db.update(pitanje).set({
    pitanje: tekst,
    odgovor,
    oblast,
    poeni,
  }).where( and( eq(pitanje.id,pitanjeId), eq(pitanje.idKviza,quizId)));
  
  
  redirect(`/kvizovi/${quizId}`);
}


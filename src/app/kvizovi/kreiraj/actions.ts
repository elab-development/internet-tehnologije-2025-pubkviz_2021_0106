"use server";

import { db } from "@/db";
import { kvizovi } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export async function noviKviz(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "Administrator" && user.role !== "Organizator")) {
    notFound();
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const zanr = formData.get("zanr") as string;

  if (!title) {
    throw new Error("Naziv kviza je obavezan");
  }

  const [kviz] = await db
    .insert(kvizovi)
    .values({
    
      title,
      description,
        hostId: user.id, // 🔥 VEZA SA USEROM
      zanr,
     
    })
    .returning();

  redirect(`/kvizovi/${kviz.id}/izmeni`);
}

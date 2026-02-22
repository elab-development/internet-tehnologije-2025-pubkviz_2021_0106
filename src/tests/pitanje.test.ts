import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { db } from "@/db";
import { kvizovi, users, pitanje } from "@/db/schema";
import { eq } from "drizzle-orm";
import { addPitanje, obrisiPitanje, izmeniPitanje } from "@/app/kvizovi/[id]/izmeni/actions";

afterEach(() => {
  vi.resetAllMocks();
  vi.resetModules();
});

// 🔹 MOCK auth
vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(async () => ({
    id: "11111111-1111-1111-1111-111111111111",
    role: "Administrator",
  })),
}));

// 🔹 MOCK next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

beforeEach(async () => {
  // ubaci test user-a ako ne postoji
  await db.insert(users).values({
    id: "11111111-1111-1111-1111-111111111111",
    username: "admin",
    email: "admin@test.com",
    passHash: "hashed",
    role: "Administrator",
  }).onConflictDoNothing();
});

describe("addPitanje integration", () => {

  it("should create pitanje for quiz", async () => {

    // 1️⃣ napravi kviz
    const [kviz] = await db.insert(kvizovi).values({
      title: "Test Kviz",
      description: "Opis",
      hostId: "11111111-1111-1111-1111-111111111111",
      zanr: "Opšti"
    }).returning();

    // 2️⃣ formData
    const formData = new FormData();
    formData.set("quizId", kviz.id);
    formData.set("tekst", "Ko je Tesla?");
    formData.set("odgovor", "Nikola Tesla");
    formData.set("oblast", "Istorija");
    formData.set("poeni", "5");

    await addPitanje(formData);

    // 3️⃣ proveri bazu
    const result = await db
      .select()
      .from(pitanje)
      .where(eq(pitanje.idKviza, kviz.id));

    expect(result.length).toBe(1);
    expect(result[0].pitanje).toBe("Ko je Tesla?");
  });

});

describe("obrisiPitanje integration", () => {

  it("should delete pitanje", async () => {

    const [kviz] = await db.insert(kvizovi).values({
      title: "Delete Test",
      description: "Opis",
      hostId: "11111111-1111-1111-1111-111111111111",
      zanr: "Opšti"
    }).returning();

    const [q] = await db.insert(pitanje).values({
      pitanje: "Brisanje pitanje",
      odgovor: "Odgovor",
      oblast: "Test",
      poeni: 5,
      idKviza: kviz.id
    }).returning();

    const formData = new FormData();
    formData.set("pitanjeId", String(q.id));
    formData.set("quizId", kviz.id);

    await obrisiPitanje(formData);

    const result = await db
      .select()
      .from(pitanje)
      .where(eq(pitanje.id, q.id));

    expect(result.length).toBe(0);
  });

});

describe("izmeniPitanje integration", () => {

  it("should update pitanje", async () => {

    const [kviz] = await db.insert(kvizovi).values({
      title: "Update Test",
      description: "Opis",
      hostId: "11111111-1111-1111-1111-111111111111",
      zanr: "Opšti"
    }).returning();

    const [q] = await db.insert(pitanje).values({
      pitanje: "Staro pitanje",
      odgovor: "Stari odgovor",
      oblast: "Test",
      poeni: 3,
      idKviza: kviz.id
    }).returning();

    const formData = new FormData();
    formData.set("pitanjeId", String(q.id));
    formData.set("quizId", kviz.id);
    formData.set("tekst", "Novo pitanje");
    formData.set("odgovor", "Novi odgovor");
    formData.set("oblast", "Nova oblast");
    formData.set("poeni", "10");

    await izmeniPitanje(formData);

    const result = await db
      .select()
      .from(pitanje)
      .where(eq(pitanje.id, q.id));

    expect(result[0].pitanje).toBe("Novo pitanje");
    expect(result[0].poeni).toBe(10);
  });

});
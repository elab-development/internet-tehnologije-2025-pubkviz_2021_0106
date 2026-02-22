import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { db } from "@/db";
import { kvizovi, users, pitanje } from "@/db/schema";
import { eq } from "drizzle-orm";
import { addPitanje, obrisiPitanje, izmeniPitanje } from "@/app/kvizovi/[id]/izmeni/actions";

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

// Ensure mocks and modules reset after each test
afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("Pitanje Integration Tests (Isolated)", () => {
  let testQuizId: string;

  beforeEach(async () => {
    // Insert test user
    await db.insert(users).values({
      id: "11111111-1111-1111-1111-111111111111",
      username: "admin",
      email: "admin@test.com",
      passHash: "hashed",
      role: "Administrator",
    }).onConflictDoNothing();

    // Create a unique quiz per test
    const [kviz] = await db.insert(kvizovi).values({
      title: `Test Kviz ${Date.now()}`,
      description: "Opis",
      hostId: "11111111-1111-1111-1111-111111111111",
      zanr: "Opšti"
    }).returning();

    testQuizId = kviz.id;
  });

  afterEach(async () => {
    // Clean up quiz and associated questions
    await db.delete(pitanje).where(eq(pitanje.idKviza, testQuizId));
    await db.delete(kvizovi).where(eq(kvizovi.id, testQuizId));
  });

  it("should create pitanje for quiz", async () => {
    const formData = new FormData();
    formData.set("quizId", testQuizId);
    formData.set("tekst", "Ko je Tesla?");
    formData.set("odgovor", "Nikola Tesla");
    formData.set("oblast", "Istorija");
    formData.set("poeni", "5");

    await addPitanje(formData);

    const result = await db
      .select()
      .from(pitanje)
      .where(eq(pitanje.idKviza, testQuizId));

    expect(result.length).toBe(1);
    expect(result[0].pitanje).toBe("Ko je Tesla?");
  });

  it("should delete pitanje", async () => {
    const [q] = await db.insert(pitanje).values({
      pitanje: "Brisanje pitanje",
      odgovor: "Odgovor",
      oblast: "Test",
      poeni: 5,
      idKviza: testQuizId
    }).returning();

    const formData = new FormData();
    formData.set("pitanjeId", String(q.id));
    formData.set("quizId", testQuizId);

    await obrisiPitanje(formData);

    const result = await db
      .select()
      .from(pitanje)
      .where(eq(pitanje.id, q.id));

    expect(result.length).toBe(0);
  });

  it("should update pitanje", async () => {
    const [q] = await db.insert(pitanje).values({
      pitanje: "Staro pitanje",
      odgovor: "Stari odgovor",
      oblast: "Test",
      poeni: 3,
      idKviza: testQuizId
    }).returning();

    const formData = new FormData();
    formData.set("pitanjeId", String(q.id));
    formData.set("quizId", testQuizId);
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
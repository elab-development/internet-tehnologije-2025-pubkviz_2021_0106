import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { noviKviz } from "@/app/kvizovi/kreiraj/actions";
import { db } from "@/db";
import { kvizovi } from "@/db/schema";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

afterEach(() => {
  vi.resetAllMocks();
  vi.resetModules();
});

beforeEach(async () => {
  await db.insert(users).values({
    id: "11111111-1111-1111-1111-111111111111",
    username: "testadmin",
    email: "test@test.com",
    passHash: "hashed",
    role: "Administrator",
  }).onConflictDoNothing();
});

// 🔹 MOCK getCurrentUser
vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(async () => ({
    id: "11111111-1111-1111-1111-111111111111",
    role: "Administrator",
  })),
}));

// 🔹 MOCK redirect
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

describe("noviKviz Server Action", () => {

  it("should insert quiz into database and call redirect", async () => {

    const formData = new FormData();
    formData.set("title", "Test Kviz");
    formData.set("description", "Test opis");
    formData.set("zanr", "Opšti");

    await noviKviz(formData);

    // 🔎 proveravamo da li postoji u bazi
    const result = await db
      .select()
      .from(kvizovi)
      .where(eq(kvizovi.title, "Test Kviz"));

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].description).toBe("Test opis");
    expect(result[0].zanr).toBe("Opšti");

    // 🧹 cleanup
    await db.delete(kvizovi).where(eq(kvizovi.title, "Test Kviz"));
  });

  it("should call notFound if user is Ucesnik", async () => {

  const { getCurrentUser } = await import("@/lib/auth");
  const { notFound } = await import("next/navigation");

  // override mock
  (getCurrentUser as any).mockResolvedValue({
    id: "11111111-1111-1111-1111-111111111111",
    role: "Ucesnik",
  });

  const formData = new FormData();
  formData.set("title", "Automatski test novi Kviz");
  formData.set("description", "Opis");
  formData.set("zanr", "Opšti");

  await noviKviz(formData);

  expect(notFound).toHaveBeenCalled();
});

});
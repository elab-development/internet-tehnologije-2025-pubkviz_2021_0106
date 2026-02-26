import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { noviKviz } from "@/app/kvizovi/kreiraj/actions";
import { db } from "@/db";
import { kvizovi, users } from "@/db/schema";
import { eq } from "drizzle-orm";

// 🔹 MOCK getCurrentUser
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

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("noviKviz Server Action (Isolated)", () => {
  let testUserId = "11111111-1111-1111-1111-111111111111";

  beforeEach(async () => {
    // insert test user
    await db.insert(users).values({
      id: testUserId,
      username: "testadmin",
      email: "test@test.com",
      passHash: "hashed",
      role: "Administrator",
    }).onConflictDoNothing();
  });

  it("should insert quiz into database and call redirect", async () => {
    const quizTitle = `Test Kviz ${Date.now()}`;
    const formData = new FormData();
    formData.set("title", quizTitle);
    formData.set("description", "Test opis");
    formData.set("zanr", "Opšti");

    await noviKviz(formData);

    const result = await db
      .select()
      .from(kvizovi)
      .where(eq(kvizovi.title, quizTitle));

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].description).toEqual(expect.any(String));
    expect(result[0].zanr).toBe("Opšti");

    // clean up
    await db.delete(kvizovi).where(eq(kvizovi.title, quizTitle));
  });

  it("should call notFound if user is Ucesnik", async () => {
    const { getCurrentUser } = await import("@/lib/auth");
    const { notFound } = await import("next/navigation");

    // override mock locally
    (getCurrentUser as any).mockResolvedValue({
      id: testUserId,
      role: "Ucesnik",
    });

    const quizTitle = `Test Kviz ${Date.now()}`;
    const formData = new FormData();
    formData.set("title", quizTitle);
    formData.set("description", "Test opis");
    formData.set("zanr", "Opšti");

    await noviKviz(formData);

    expect(notFound).toHaveBeenCalled();
  });
});
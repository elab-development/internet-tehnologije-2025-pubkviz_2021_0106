import { describe, it, expect } from "vitest";

// ovo imitira logiku addPitanje koja validira podatke
function validateQuestionData(data: FormData) {
  const quizId = data.get("quizId") as string;
  const tekst = data.get("tekst") as string;
  const odgovor = data.get("odgovor") as string;
  const oblast = data.get("oblast") as string;
  const poeni = Number(data.get("poeni"));

  if (!quizId || !tekst || !odgovor || !oblast || !poeni) return false;
  if (poeni <= 0) return false;

  return true;
}

describe("Question Data Validation", () => {

  it("should validate proper question", () => {
    const formData = new FormData();
    formData.set("quizId", "quiz1");
    formData.set("tekst", "Koja drzava ima najvise vremenskih zona?");
    formData.set("odgovor", "Francuska");
    formData.set("oblast", "Geografija");
    formData.set("poeni", "2");

    expect(validateQuestionData(formData)).toBe(true);
  });

  it("should invalidate question with missing text", () => {
    const formData = new FormData();
    formData.set("quizId", "quiz1");
    formData.set("tekst", "");
    formData.set("odgovor", "Francuska");
    formData.set("oblast", "Geografija");
    formData.set("poeni", "2");

    expect(validateQuestionData(formData)).toBe(false);
  });

  it("should invalidate question with 0 points", () => {
    const formData = new FormData();
    formData.set("quizId", "quiz1");
    formData.set("tekst", "Pitanje");
    formData.set("odgovor", "Odgovor");
    formData.set("oblast", "Opsta");
    formData.set("poeni", "0");

    expect(validateQuestionData(formData)).toBe(false);
  });

  it("should invalidate question with missing poeni", () => {
    const formData = new FormData();
    formData.set("quizId", "quiz1");
    formData.set("tekst", "Pitanje");
    formData.set("odgovor", "Odgovor");
    formData.set("oblast", "Opsta");
    // poeni nisu postavljeni
    expect(validateQuestionData(formData)).toBe(false);
  });

});
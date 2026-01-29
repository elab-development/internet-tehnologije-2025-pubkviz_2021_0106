"use client";

import { addPitanje } from "@/app/kvizovi/[id]/izmeni/actions";

export default function EditForm({ quizId }: { quizId: string }) {
  return (
    <div className="w-full h-full p-2 flex flex-col gap-10">

      {/* DODAJ PITANJE */}
      <form action={addPitanje} className="flex flex-col gap-4">
        <h2 className="font-bold">Dodaj novo pitanje</h2>

        <input type="hidden" name="quizId" value={quizId} />

        <input
          name="tekst"
          className="border rounded p-2"
          placeholder="Unesi tekst pitanja..."
          required
        />

        <input
          name="odgovor"
          className="border rounded p-2"
          placeholder="Unesi odgovor"
          required
        />

        <input
          name="oblast"
          className="border rounded p-2"
          placeholder="Unesi oblast"
        />

        <input
          name="poeni"
          type="number"
          className="border rounded p-2"
          placeholder="Broj poena"
          required
        />

        <button className="bg-amber-600 hover:bg-blue-400 p-2 rounded">
          Submit
        </button>
      </form>

    </div>
  );
}

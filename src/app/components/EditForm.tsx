"use client";

import { addPitanje,izmeniPitanje,obrisiPitanje,izmeniLokaciju } from "@/app/kvizovi/[id]/izmeni/actions";
import { getCurrentUser } from "@/lib/auth";
import GenerisiPitanja from "./GenerateButton";
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

        <button id="dodajPitanje" className="bg-amber-600 hover:bg-blue-400 p-2 rounded">
          Submit
        </button>
        
      </form>
      <GenerisiPitanja quizId={quizId} />
        {/*Obrisi*/}
      <form action={obrisiPitanje} className="flex flex-col gap-4">
         <h2 className="font-bold">Obrisi neko pitanje</h2>

        <input type="hidden" name="quizId" value={quizId} />

        <input
        name="pitanjeId"
        className="border rounded p-2"
        placeholder="Unesi id pitanja"
        required
      />

      <button id="obrisiPitanje" className="bg-red-600 hover:bg-red-400 p-2 rounded">
        Obriši
      </button>
    </form>
      {/*Izmeni*/}
    <form action={izmeniPitanje} className="flex flex-col gap-4">
  <h2 className="font-bold">Izmeni pitanje</h2>

  <input type="hidden" name="quizId" value={quizId} />

  <input
    name="pitanjeId"
    className="border rounded p-2"
    placeholder="ID pitanja"
    required
  />

  <input className="border rounded p-2" name="tekst" placeholder="Tekst pitanja" />
  <input className="border rounded p-2" name="odgovor" placeholder="Odgovor" />
  <input className="border rounded p-2" name="oblast" placeholder="Oblast" />
  <input data-testid="edit-poeni" className="border rounded p-2" name="poeni" type="number" placeholder="Poeni" />

  <button data-testid="save-edit" id="izmeniPitanje" className="bg-blue-600 p-2 rounded hover:bg-amber-500">Sačuvaj</button>
</form>

<form action={izmeniLokaciju} className="flex flex-col gap-">
  <h2 className="font-bold">Izmeni lokaciju kviza</h2>

  <input type="hidden" name="quizId" value={quizId} />
  <label htmlFor="mesto"></label>
  <input
    id="mesto"
    name="mesto"
    type="text"
    placeholder="Mesto"
    className="border p-2 rounded"
  />



  <label htmlFor="lokacija"></label>
  <input
    id="adresa"
    name="adresa"
    type="text"
    placeholder="Adresa"
    className="border p-2 rounded"
  />
  <button data-testid="save-edit" id="izmeniLokaciju" className="bg-blue-600 p-2 rounded hover:bg-amber-500">Sačuvaj</button>
</form>

    </div>
  );
}

import { noviKviz } from "./actions";


export default function CreateQuiz() {
    return(
         
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Novi kviz</h1>

      <form action={noviKviz} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Naziv kviza"
          required
          className="border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Opis kviza"
          className="border p-2 rounded"
        />

        <input
          name="zanr"
          placeholder="Kategorija"
          className="border p-2 rounded"
        />

        <button className="bg-green-600 text-white p-2 rounded hover:bg-green-300">
          Kreiraj kviz
        </button>
      </form>
    </div>
    );
}
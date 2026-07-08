"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  quizId: string;
  onClose: () => void;
};

export default function GenerisiInterfejs({
  quizId,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  const router = useRouter();
  
  const [tema, setTema] = useState("");
  const [tezina, setTezina] = useState("Srednje");
  const [brojPitanja, setBrojPitanja] = useState(5);
async function handleGenerate() {
  try {
    setLoading(true);
    setError("");

    const response = await fetch("/api/ai/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizId,
        tema,
        tezina,
        brojPitanja,
      }),
    });

    const data = await response.json();

    console.log(data.text);

    if (data.success) {
      onClose();
      router.push(`/kvizovi/${quizId}`);
      router.refresh();
    } else {
      setError("Greška prilikom generisanja pitanja.");
    }

  } catch (error) {
    console.error(error);
    setError("Došlo je do greške.");
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          Generisanje pitanja
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">
              Tema
            </label>

            <input
              type="text"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="npr. Harry Potter"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Težina
            </label>

            <select
              value={tezina}
              onChange={(e) => setTezina(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option>Lako</option>
              <option>Srednje</option>
              <option>Teško</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Broj pitanja
            </label>

            <input
              type="number"
              min={1}
              max={30}
              value={brojPitanja}
              onChange={(e) =>
                setBrojPitanja(Number(e.target.value))
              }
              className="w-full border rounded-md p-2"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Otkaži
          </button>

          <button
  onClick={handleGenerate}
  disabled={loading}
  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
>
  {loading ? "🤖 Generišem pitanja..." : "Generiši"}
</button>
{error && (
  <p className="text-red-500 mt-4">
    {error}
  </p>
)}

        </div>

      </div>
    </div>
  );
}
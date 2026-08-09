"use client";

import { useState } from "react";
import { noviKviz } from "./actions";

export default function CreateQuizForm() {
  const [showModal, setShowModal] = useState(false);
  const [mesto, setMesto] = useState("");
  const [lokacija, setLokacija] = useState("");

  const [preporuceniGrad, setPreporuceniGrad] = useState("");
  const [brojTimova, setBrojTimova] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [prethodnaPreporuka, setPrethodnaPreporuka] = useState("");

  async function preporuciLokaciju() {
    if (!preporuceniGrad.trim()) {
      setError("Unesite grad.");
      return;
    }

    if (!brojTimova || Number(brojTimova) <= 0) {
      setError("Unesite broj timova.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/preporuci-lokaciju", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  mesto: preporuceniGrad,
  brojTimova: Number(brojTimova),
  prethodnaPreporuka,
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška prilikom preporuke.");
      }

      setLokacija(data.preporuka.adresa);

      setPrethodnaPreporuka(data.preporuka.naziv);

      if (!mesto.trim()) {
        setMesto(preporuceniGrad);
      }

      setShowModal(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Došlo je do greške."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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

        <input
          name="mesto"
          placeholder="Mesto"
          value={mesto}
          onChange={(e) => setMesto(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          name="adresa"
          placeholder="Adresa"
          value={lokacija}
          onChange={(e) => setLokacija(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="button"
          onClick={() => {
            setPreporuceniGrad(mesto);
            setShowModal(true);
            setError("");
          }}
          className="border p-2 rounded hover:bg-gray-100"
        >
          Preporuči adresu
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-300"
        >
          Kreiraj kviz
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Preporuči adresu
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  Grad
                </label>

                <input
                  value={preporuceniGrad}
                  onChange={(e) =>
                    setPreporuceniGrad(e.target.value)
                  }
                  placeholder="Npr. Beograd"
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Očekivani broj timova
                </label>

                <input
                  type="number"
                  min="1"
                  value={brojTimova}
                  onChange={(e) =>
                    setBrojTimova(e.target.value)
                  }
                  placeholder="Npr. 10"
                  className="border p-2 rounded w-full"
                />

                <p className="text-sm text-gray-500 mt-1">
                  Timovi imaju između 3 i 6 članova.
                </p>
              </div>

              {error && (
                <p className="text-red-600 text-sm">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="border p-2 rounded flex-1"
                >
                  Otkaži
                </button>

                <button
                  type="button"
                  onClick={preporuciLokaciju}
                  disabled={loading}
                  className="bg-blue-600 text-white p-2 rounded flex-1"
                >
                  {loading ? "Pretražujem..." : "Predloži"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
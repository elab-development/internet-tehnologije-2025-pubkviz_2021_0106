"use client";

import { useState } from "react";
import GenerisiInterfejs from "./GenerisiInterfejs";

type Props = {
  quizId: string;
};

export default function GenerisiPitanja({ quizId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        🤖 Generiši pitanja
      </button>

      {open && (
        <GenerisiInterfejs
          quizId={quizId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
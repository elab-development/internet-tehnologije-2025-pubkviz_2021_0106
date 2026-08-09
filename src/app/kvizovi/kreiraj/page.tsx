import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import CreateQuizForm from "./CreateQuizForm";

export default async function CreateQuiz() {
  const user = await getCurrentUser();

  if (
    !user ||
    (user.role !== "Administrator" && user.role !== "Organizator")
  ) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Novi kviz
      </h1>

      <CreateQuizForm />
    </div>
  );
}
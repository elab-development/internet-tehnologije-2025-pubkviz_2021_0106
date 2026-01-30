import EditForm from "@/app/components/EditForm";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { pitanje } from "@/db/schema";

export default async function Izmeni({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
        
      if (!user || (user.role !== "Administrator" && user.role !== "Organizator")) {
        notFound();
      }

  return <EditForm quizId={id}/>;
}

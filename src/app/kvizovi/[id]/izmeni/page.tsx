import EditForm from "@/app/components/EditForm";

export default async function Izmeni({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditForm quizId={id} />;
}

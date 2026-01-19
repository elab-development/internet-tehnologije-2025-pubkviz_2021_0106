export default function QuizPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">
        Quiz ID: {params.id}
      </h1>

      <p className="mt-4 text-gray-600">
        This will later show quiz details, questions, leaderboard, and winners.
      </p>
    </div>
  );
}

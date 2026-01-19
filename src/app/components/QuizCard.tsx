import Link from "next/link";

type QuizCardProps = {
  quiz: {
    id: number | string;
    title: string;
    date: string;
    description: string;
  };
};

export default function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Link href={`/kvizovi/${quiz.id}`}>
      <article className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
        <h2 className="text-lg font-semibold">
          {quiz.title}
        </h2>

        <p className="text-sm text-gray-500">
          {quiz.date}
        </p>

        <p className="mt-2 text-sm text-gray-700">
          {quiz.description}
        </p>
      </article>
    </Link>
  );
}

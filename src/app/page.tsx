import Image from "next/image";
import Sidebar from "./components/Sidebar";
import QuizList from "./components/QuizList";
import Sidebar2 from "./components/Sidebar2";
import QuizCard from "./components/QuizCard";


const quizzes = [
  {
    id: 1,
    title: "Friday Pub Quiz",
    date: "Jan 20, 2026",
    description: "General knowledge quiz with a fun twist.",
  },
  {
    id: 2,
    title: "Sports Night",
    date: "Jan 22, 2026",
    description: "All about football, basketball, and more.",
  },
];

export default function Home() {
  return (
    <>
      <Sidebar />
    <main className="flex-1 p-4">
       {/*<QuizList />*/}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {quizzes.map(q => (
        <QuizCard key={q.id} quiz={q} />
      ))}
    </div>
    </main>
      <Sidebar2 />
    
    </>
  );
}

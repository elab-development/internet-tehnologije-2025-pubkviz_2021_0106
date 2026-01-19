import Image from "next/image";
import Sidebar from "./components/Sidebar";
import QuizList from "./components/QuizList";
import Sidebar2 from "./components/Sidebar2";
import QuizCard from "./components/QuizCard";
import { db } from "@/db";
import { kvizovi } from "@/db/schema";
//import { kvizovi } from "@/db/schema";


const quizzesDB = await db.select().from(kvizovi);

const quizzes = quizzesDB.map(q => ({
    id: q.id, // UUID → string
    title: q.title,
    description: q.description ?? "",
    date: q.createdAt
      ? q.createdAt.toLocaleDateString()
      : "Unknown date",
  }));

  

export default function Home() {
  return (
    <>
      <Sidebar />
    <main className="flex-1 p-4">
       {/*<QuizList />*/}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {quizzes.map(q => {
        console.log("LIST ID:", q.id, typeof q.id);
       return <QuizCard key={q.id} quiz={q} />
      })}
      
    </div>
    </main>
      <Sidebar2 />
    
    </>
  );
}


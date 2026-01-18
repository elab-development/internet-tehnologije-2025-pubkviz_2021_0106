import Image from "next/image";
import Sidebar from "./components/Sidebar";
import QuizList from "./components/QuizList";

export default function Home() {
  return (
    <>
      <Sidebar />
    <main className="flex-1 p-4">
       <QuizList />
    </main>
    
    </>
  );
}

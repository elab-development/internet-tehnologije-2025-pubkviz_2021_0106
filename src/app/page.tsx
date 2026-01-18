import Image from "next/image";
import Sidebar from "./components/Sidebar";
import QuizList from "./components/QuizList";
import Sidebar2 from "./components/Sidebar2";

export default function Home() {
  return (
    <>
      <Sidebar />
    <main className="flex-1 p-4">
       <QuizList />
    </main>
      <Sidebar2 />
    
    </>
  );
}

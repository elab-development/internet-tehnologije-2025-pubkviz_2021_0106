"use client";

import { getCurrentUser } from "@/lib/auth";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";


export default function EditButton ({ quizId }: { quizId: string }){
    const router = useRouter();
    const user = useAuth();
     return (
    <button
      onClick={() =>   !(user.user) || user.user.role==="Ucesnik" 
        ? alert("Nemate dozvolu da menjate ovaj kviz.") 
        : router.push(`/kvizovi/${quizId}/izmeni`)
    
    
    }
      className=" bg-amber-600 hover:bg-blue-400 px-3"
    >
      Izmeni kviz
    </button>
  );
}
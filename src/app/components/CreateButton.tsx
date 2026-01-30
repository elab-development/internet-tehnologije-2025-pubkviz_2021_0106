"use client";

import { useRouter } from "next/navigation";
import { useAuth, User } from "./AuthProvider";
import { JwtUserClaims } from "@/lib/auth";

export default function CreateButton (){
    const router = useRouter();
    const user = useAuth();
     return (
    <button
      onClick={()=>!(user.user) || user.user.role==="Ucesnik" 
        ? alert("Nemate dozvolu da napravite novi kviz.") 
        : router.push(`/kvizovi/kreiraj`)




      }
      className=" bg-amber-600 hover:bg-blue-400 px-3"
    >
      Napravi novi kviz
    </button>
  );
}
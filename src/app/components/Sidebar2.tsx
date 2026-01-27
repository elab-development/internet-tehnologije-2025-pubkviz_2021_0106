"use client";

import { useRouter } from "next/navigation";


import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";


export default function Sidebar2() {
  const router = useRouter();

 const { status,user,logout } = useAuth();
  const isLoggedIn = status === "authenticated";

  const [open,setOpen] = useState(false);


  const handleLogout = async () => {
    // TODO: remove user session / auth token
    console.log("Logged out");
    // You can choose:
    // router.push("/login"); // redirect to login page
    // or stay on homepage (just remove session)
    await logout();
    setOpen(false);
  };

  return (
    <aside className="w-[200px] p-4 border-l border-gray-300 flex flex-col items-start gap-4">
      <button
      
        className="w-full text-left p-2 hover:bg-gray-100 rounded"
        
        onClick={() => isLoggedIn ?  router.push("/profile") : router.push("/login")}
        
      >
         {isLoggedIn ? user?.username : "Profile"}
       
      </button>

      <button
        className="w-full text-left p-2 hover:bg-gray-100 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>

      {/* Optional calendar placeholder */}
      <div className="mt-4 w-full">
        <strong>Predstojeci kvizovi</strong>
        <div className="mt-2 p-2 border rounded text-sm text-gray-500">
          Jan 20 - Sports Night <br />
          Jan 22 - History Quiz
        </div>
      </div>
    </aside>
  );
}

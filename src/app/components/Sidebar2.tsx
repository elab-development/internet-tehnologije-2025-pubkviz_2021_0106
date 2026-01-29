"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import CreateButton from "./CreateButton";

export default function Sidebar2() {
  const router = useRouter();
  const auth = useAuth();

  if (auth.status === "loading") return null;

  return (
    <aside className="w-50 p-4 border-l border-gray-300 flex flex-col gap-4">
      <button
        className="w-full text-left p-2 hover:bg-gray-100 rounded"
        onClick={() =>
          auth.status === "authenticated" ? router.push("/profile") : router.push("/login")
        }
      >
        {auth.status === "authenticated" ? auth.user.username : "Log in"}
      </button>

      {auth.status === "authenticated" && (
        <button
          className="w-full text-left p-2 hover:bg-gray-100 rounded"
          onClick={auth.logout}
        >
          Logout
        </button>
      )}
      <CreateButton></CreateButton>
      
    </aside>
  );
}

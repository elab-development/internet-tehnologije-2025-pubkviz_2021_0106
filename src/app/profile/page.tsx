import { db } from "@/db";
import { ekipa, ekipaClanovi } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userTeams = await db
    .select({
      id: ekipa.id,
      naziv: ekipa.naziv,
    })
    .from(ekipaClanovi)
    .innerJoin(ekipa, eq(ekipaClanovi.ekipaId, ekipa.id))
    .where(eq(ekipaClanovi.userId, user.id));


  return (
<div className="w-full flex items-center justify-center p-6">     
     <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="flex flex-col items-center">

          {/* Privremeni avatar */}
          <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>


          <h1 className="mt-4 text-3xl font-bold">
            {user.username}
          </h1>


          <div className="w-full mt-8 space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Član od
              </p>

              <p className="font-medium">
  {user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("sr-RS")
    : "Nepoznato"}
</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Uloga
              </p>

              <p className="font-medium">
                {user.role}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Ekipa
              </p>


              {userTeams.length === 0 ? (
                <p className="font-medium text-gray-600">
                  Nije član nijedne ekipe
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {userTeams.map((team) => (
                    <span
                      key={team.id}
                      className="px-3 py-1 rounded-full bg-gray-200 text-sm font-medium"
                    >
                      {team.naziv}
                    </span>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
    username: string;
    email: string;
    password: string;

};

export async function POST(req:Request) {
    
  const { username, email, password } = (await req.json()) as Body;

  
  if (!username || !email || !password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

 
  const exists = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (exists.length) {
    return NextResponse.json(
      { error: "Email postoji u bazi" },
      { status: 400 }
    );
  }

  
  const passHash = await bcrypt.hash(password, 10);

  const [u] = await db
    .insert(users)
    .values({ username, email, passHash })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role
    });

 
  const token = signAuthToken({
    sub: u.id,
    email: u.email,
    username: u.username,
    role: u.role,

  });


  const res = NextResponse.json(u);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  // Return JSON user data – frontend dobija podatke o novom korisniku
  return res;

}

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
    // 1. Parse request – iz request-a izdvajamo name, email i password
  const { username, email, password } = (await req.json()) as Body;

  // 2. Validate input – proveravamo da li su sva polja prisutna
  // Ako neki podatak nedostaje, vraćamo 400
  if (!username || !email || !password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

  // 3. Check if user already exists – proveravamo da li email već postoji u bazi
  // Ako korisnik postoji, vraćamo 400
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

  // 4. Hash password – heširamo lozinku pre čuvanja u bazi
  const passHash = await bcrypt.hash(password, 10);

  // 5. Create user – upisujemo novog korisnika u bazu
  // Vraćamo osnovne podatke o korisniku
  const [u] = await db
    .insert(users)
    .values({ username, email, passHash })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
    });

  // 6. Sign JWT – generišemo JWT token za novoregistrovanog korisnika
  const token = signAuthToken({
    sub: u.id,
    email: u.email,
    username: u.username,
  });

  // 7. Set cookie with JWT – postavljamo token u cookie
  // Cookie je httpOnly i secure (definisano u cookieOpts)
  const res = NextResponse.json(u);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  // 8. Return JSON user data – frontend dobija podatke o novom korisniku
  return res;

}

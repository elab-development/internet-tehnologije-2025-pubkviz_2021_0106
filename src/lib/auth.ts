import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as jwt from "jsonwebtoken"
import { cookies } from "next/headers";

export const AUTH_COOKIE = "auth";
const JWT_SECRET = process.env.JWT_SECRET!;

if(!JWT_SECRET){
    throw new Error("Missing JWT_SECRET in env file")
}

export type JwtUserClaims = {
    sub: string; //subject - standardno za jwt obicno neki id
    email: string;
    username?: string;
    role: string;
}

export function signAuthToken(claims: JwtUserClaims){
    return jwt.sign(claims, JWT_SECRET, { algorithm: "HS256",expiresIn: "7d" })
} 

// verifikujemo token, verify() vraca string pa ga pakujemo u JwtUserClaims
// i posle uspesne verifikacije, ne znamo da li je vratio sve podatke pa proveravamo da li ima obavezne claim-ove

export function verifyAuthToken(token: string): JwtUserClaims {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtUserClaims; // vraca string pa ga kastujemo

    //ako je validan, ne znaci da ima sva polja
    if (!payload || !payload.sub || !payload.email) throw new Error("Invalid token");
    return {
        sub: payload.sub,
        email: payload.email,
        username: payload.username,
        role: payload.role
    }
}

// dodatne opcije za cookie (ne za JWT)
export function cookieOpts() {
    return {
        httpOnly: true, // ne moze se pristupiti kroz JS, zastita od XSS napada
        sameSite: "lax" as const, // ogranicava pristup na normalnu navigaciju kroz isti sajt, stiti od CSRF
        secure: process.env.NODE_ENV === "production", // na produkciji salje token samo kroz HTTPS 
        path: "/", // dostupan na svim rutama
        maxAge: 60 * 60 * 24 * 7 // 7 dana traje cookie, nema potrebe da postoji duze od JWT
    }
}





export async function getCurrentUser() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const claims = verifyAuthToken(token);

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
        role: users.role, 
      })
      .from(users)
      .where(eq(users.id, claims.sub));

    return user ?? null;
  } catch {
    return null;
  }
}

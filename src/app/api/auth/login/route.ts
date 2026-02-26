import { useAuth } from "@/app/components/AuthProvider";
// Import konekcije na bazu i tabele
import { db } from "@/db";                      // Konekcija na PostgreSQL preko Drizzle ORM
import { users } from "@/db/schema";            // Tabela 'users' iz Drizzle schema fajla

// Import helper-a za autentifikaciju i cookie
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth"; 
// AUTH_COOKIE → ime cookie-ja
// cookieOpts() → opcije za cookie (httpOnly, secure, maxAge)
// signAuthToken → funkcija koja generiše JWT token

// Biblioteka za heširanje lozinki
import bcrypt from "bcrypt";

// Helper iz Drizzle ORM za WHERE klauzulu
import { eq } from "drizzle-orm";

// Next.js helper za 404 (nije korišćen u ovom fajlu)
import { notFound } from "next/navigation";

// Next.js helper za kreiranje response objekta
import { NextResponse } from "next/server";


// Definišemo TypeScript tip za request body
type Body = {
    email: string;       // email koji korisnik šalje
    password: string;    // lozinka koju korisnik šalje
};


// API ruta koja reaguje na POST request
export async function POST(req: Request) {

    // 1️⃣ Parsiramo JSON body request-a i izvadimo email i password
    const {email, password} = (await req.json()) as Body;

    // 2️⃣ Validacija input-a: provjeravamo da li su oba polja unesena
    if (!email || !password) {
        return NextResponse.json(
            { error: "Pogesan email ili lozinka" },
            { status: 401 }          // Unauthorized
        );
    }

    // 3️⃣ Tražimo korisnika u bazi po email-u
    const [u] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));   // eq -> users.email = email

    // Ako korisnik ne postoji, vraćamo 401
    if (!u) {
        return NextResponse.json(
            { error: "Pogesan email ili lozinka - korisnika nema u bazi" },
            { status: 401 }
        );
    }

    // 4️⃣ Provjera lozinke: upoređujemo unesenu lozinku sa hash-om iz baze
    const ok = await bcrypt.compare(password, u.passHash);
    if (!ok) {
        return NextResponse.json(
            { error: "Pogesan email ili lozinka" },
            { status: 401 }
        );
    }

    // 5️⃣ Generišemo JWT token sa informacijama o korisniku
    const token = signAuthToken({
        sub: u.id,           // sub → ID korisnika
        email: u.email,      // email korisnika
        username: u.username,// korisničko ime
        role: u.role,        // admin ili korisnik
    });

    // 6️⃣ Kreiramo response JSON objekat sa osnovnim podacima korisnika
    const res = NextResponse.json({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
    });

    // 7️⃣ Postavljamo cookie sa JWT tokenom
    res.cookies.set(AUTH_COOKIE, token, cookieOpts()); 
    // cookie je httpOnly i secure → ne može se čitati sa frontend JS-a

    // 8️⃣ Vraćamo response frontend-u
    return res;
}



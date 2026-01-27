"use client";

import Link from "next/link";
import { FormEvent,useState } from "react";
import { useRouter } from "next/navigation";



type Mode = "login" | "register";

export default function AuthForm({ mode }: {mode: Mode}) {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");


    const [err,setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const title = mode === "login" ? "Prijavi se na svoj nalog" : "Napravi novi nalog";
    const btnLabel = mode === "login" ? "Prijavi se" : "Registruj se";
    const switchLine =
        mode === "login" 
        ? (["Niste registrovani?", "Registruj se", "/register"] as const)
        : (["Već imate nalog?", "Prijavi se", "/login"]as const);


    //submit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErr("");
        setLoading(true)
        
        try {
            //postavljamo endpoint kako bismo znali koju rutu na back-u da gadjamo
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"

            //kreiramo body za request, pogledati src/app/auth/login/route.ts
            const body = mode === "login" ? { email, password: pwd } : { username, email, password: pwd }
            //saljemo zahtev i odgovor upisujemo u res
            const res = await fetch(endpoint, {
                method: "POST",
                credentials: "include", // dozvoljava Set-Cookie na back-u
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body) //pretvara body u JSON string 
            })
            //u slucaju greske, ako je error kod 400-599
            if (!res.ok) {
                let message = "Greska pri autentifikaciji";
                let data;
                try {
                    data = await res.json();
                    message = data?.error ?? message;
                } catch {
                    message = (data as string) || message;
                }
                setErr(message);
                return;
            }
            // Set-Cookie je već stigao iz API-ja, odradjeno na serveru
            // teramo ga da ponovo pokrene sve serverske komponente, ucita cookie i azurira stanje
            router.refresh();
            router.push("/");
        } finally {
            setLoading(false); //cak I ako pukne kod, moramo da ugasimo loader
        }


    }    


    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 w-full">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="test" 
                className="mx-auto h-10 w-auto"/>
                            <h1 className="mt-4 text-center text-xl font-bold text-indigo-600">pub kviz</h1>
                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                    {title}
                </h2>
            </div>
                
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === "register" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Username</label>
                            <input
                                type="text"
                                required

                                value={username}
                                onChange={(e) => setUsername(e.target.value)}

                                className="mt-2 block w-full rounded-md border border-gray-300 
                                bg-white px-3 py-1.5 text-base placeholder:text-gray-400 
                                focus:border-indigo-600 focus:outline-none sm:text-sm"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Email adresa</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Lozinka</label>
                        <input
                            type="password"
                            required
                            value={pwd}
                            onChange={(e)=>setPwd(e.target.value)}
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                            className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none sm:text-sm"
                        />
                    </div>

                    {err && <p className="text-sm text-red-600">{err}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-2 focus:outline-indigo-600"
                    >
                        {loading ? "Obrada..." : btnLabel}
                    </button>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    {switchLine[0]}{" "}
                    <Link href={switchLine[2]} className="font-semibold text-indigo-600 hover:text-indigo-500">
                        {switchLine[1]}
                    </Link>
                </p>
            </div>



        </div>
    )
}
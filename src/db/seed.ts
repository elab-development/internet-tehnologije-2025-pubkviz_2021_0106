import "dotenv/config";
import { kvizovi, pitanje, users } from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("1233", 10);

const idOpsti = "7a0a1e00-9651-4071-86b8-ed32dba35bb9";


await db.transaction(async (tx) => {

           await tx.insert(users).values([
            {
            //id: "7a0a1e00-9651-4071-86b8-ed32dba35bf2",
            username: "coa",
            email: "coa@gmail.com",
            role:"Administrator",
            passHash: hash,
        },
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf2",
            username: "Nikola Tesla",
            email: "tesla@gmail.com",
            passHash: hash,
        },
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf3",
            username: "Petar Petrović",
            email: "petrovic@gmail.com",
            passHash: hash,
        },
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf4",
            username: "Novak Đoković",
            email: "djokovic@gmail.com",
            passHash: hash,
        },
    ]);

    await tx.insert(kvizovi).values([
       {
        id: "7a0a1e00-9651-4071-86b8-ed32dba35bf9",
        title: "sportski",
        description: "sportski test",
        hostId: "7a0a1e00-9651-4071-86b8-ed32dba35bf2",
        zanr: "sportski"
       },
       {
        id: "7a0a1e00-9651-4071-86b8-ed32dba35bb9",
        title: "Opsti",
        description: "Opsti kviz",
        hostId: "7a0a1e00-9651-4071-86b8-ed32dba35bf4",
        zanr: "opsti"
       },
    ]);

    await tx.insert(pitanje).values([
            {
                      
                          pitanje: "Beogradska ulica Kralja Milana nekada se zvala?",
                          odgovor: "Ulica srpskih vladara",
                          oblast: "opste",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Koja drzava ima najvise vremenskih zona?",
                          odgovor: "Francuska",
                          oblast: "opste",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Koja drzava je prva uvela opste pravo glasa za zene?",
                          odgovor: "Novi Zeland",
                          oblast: "opste",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Koja planeta ima najviše poznatih prirodnih satelita?",
                          odgovor: "Saturn",
                          oblast: "opste",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
           
                   {
                      
                          pitanje: "Reka Ind izvire u kojoj drzavi, a kroz koju tece njen najveci deo?",
                          odgovor: "Kina, Pakistan ",
                          oblast: "geografija",
                          poeni: 4,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Koji je najveci okean na Zemlji?",
                          odgovor: "Tihi",
                          oblast: "geografija",
                          poeni: 1,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Koja banja u Srbiji je poznata po najtoplijoj termalnoj vodi",
                          odgovor: "Vranjska ",
                          oblast: "geografija",
                          poeni: 4,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Kako se zove drugi najvisi vrh na svetu",
                          odgovor: "K2",
                          oblast: "geografija",
                          poeni: 4,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Kako glasi naziv za drveni tocak za navodnavanje, koji je i naziv pesme Milana Rakica?",
                          odgovor: "Dolap",
                          oblast: "knjizevnost",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Pre svoje knjizevne karijere bile su uciteljice, a poznate su po naslovima kao sto su Dzejn Ejr i Orkanski visovi. Ima ih tri a njihovo prezime glasi?",
                          odgovor: "Bronte",
                          oblast: "knjizevnost",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Frankenstajna napisala je?",
                          odgovor: "Meri Seli",
                          oblast: "knjizevnost",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Prvo izdanje vukovog recnika izaslo je?",
                          odgovor: "1818. godine",
                          oblast: "knjizevnost",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Nemacka invazija na Grcku nosila je siforani naziv?",
                          odgovor: "Marita",
                          oblast: "istorija",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Tursko osvajanje Carigrada desilo se 29. maja koje godine?",
                          odgovor: "1453.",
                          oblast: "istorija",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Sretenjski ustav donet je koje godine?",
                          odgovor: "1835.",
                          oblast: "istorija",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
                   {
                      
                          pitanje: "Staro ime Smederevske Palanke glasi",
                          odgovor: "Selevac",
                          oblast: "istorija",
                          poeni: 2,
                          idKviza: idOpsti,
                   },
           
        ]);
});

process.exit(0);
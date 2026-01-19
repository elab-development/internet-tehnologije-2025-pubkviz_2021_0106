import "dotenv/config";
import { kvizovi, users } from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("1233", 10);

await db.transaction(async (tx) => {
    await tx.insert(users).values([
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
        hostId: "7a0a1e00-9651-4071-86b8-ed32dba35bf2"
       },
    ]);
});

process.exit(0);


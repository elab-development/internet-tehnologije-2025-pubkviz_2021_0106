import {pgTable, serial, varchar, integer, timestamp, uuid, text, boolean, pgEnum} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "Ucesnik",
  "Organizator",
  "Administrator",
]);


// Korisnici
export const users = pgTable("users", {
    id:         uuid("id").primaryKey().defaultRandom(),
    username:   varchar("username",  { length: 100 }).notNull(),
    email:      varchar("email", { length: 255 }).notNull().unique(),
    passHash:   varchar("pass_hash", { length: 255 }).notNull(),
    role:       userRoleEnum("role").notNull().default("Ucesnik"),
    createdAt:  timestamp("created_at").defaultNow(),
});

export const kvizovi = pgTable("kvizovi", {
    id:      uuid("id").primaryKey().defaultRandom(),
    title:   varchar("title",  { length: 100 }).notNull(),
    description: text("description"),
    hostId: uuid("host_id").notNull().references(()=>users.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at").defaultNow(),
    zanr: varchar("zanr",  { length: 100 }).notNull(),
});

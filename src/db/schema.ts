import {pgTable, serial, varchar, integer, timestamp, uuid, text, boolean, pgEnum, primaryKey} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "Ucesnik",
  "Organizator",
  "Administrator",
]);
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

export const pitanje = pgTable("pitanje", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    pitanje: text("pitanje").notNull(),
    odgovor: text("odgovor").notNull(),
    oblast: text("oblast").notNull(),
    poeni: integer("poeni").notNull(),
    idKviza: uuid("idKviza").notNull().references(()=>kvizovi.id, {onDelete: "cascade"}),
})

export const ekipa = pgTable("ekipa", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  poeni: integer("poeni").default(0),
  rank: integer("rank"),
});

export const ekipaClanovi = pgTable(
  "ekipa_clanovi",
  {
    ekipaId: integer("ekipa_id")
      .notNull()
      .references(() => ekipa.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.ekipaId, t.userId] }),
  })
);



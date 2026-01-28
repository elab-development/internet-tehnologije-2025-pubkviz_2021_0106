CREATE TABLE "pitanje" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pitanje_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"pitanje" text NOT NULL,
	"odgovor" text NOT NULL,
	"idKviza" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pitanje" ADD CONSTRAINT "pitanje_idKviza_kvizovi_id_fk" FOREIGN KEY ("idKviza") REFERENCES "public"."kvizovi"("id") ON DELETE cascade ON UPDATE no action;
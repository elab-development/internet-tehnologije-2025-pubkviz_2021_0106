CREATE TABLE "ekipa" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ekipa_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"poeni" integer DEFAULT 0,
	"rank" integer
);
--> statement-breakpoint
CREATE TABLE "ekipa_clanovi" (
	"ekipa_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "ekipa_clanovi_ekipa_id_user_id_pk" PRIMARY KEY("ekipa_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "ekipa_clanovi" ADD CONSTRAINT "ekipa_clanovi_ekipa_id_ekipa_id_fk" FOREIGN KEY ("ekipa_id") REFERENCES "public"."ekipa"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ekipa_clanovi" ADD CONSTRAINT "ekipa_clanovi_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
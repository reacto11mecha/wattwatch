CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pg-drizzle_gedung" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"nama" text NOT NULL,
	"alamat" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pg-drizzle_log_konsumsi" (
	"id" text PRIMARY KEY NOT NULL,
	"ruangan_id" text NOT NULL,
	"konsumsi_kwh" real NOT NULL,
	"estimasi_biaya" real NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pg-drizzle_notifikasi" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"ruangan_id" text,
	"judul" text NOT NULL,
	"deskripsi" text NOT NULL,
	"severity" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pg-drizzle_perangkat" (
	"id" text PRIMARY KEY NOT NULL,
	"ruangan_id" text NOT NULL,
	"nama" text NOT NULL,
	"tipe" text NOT NULL,
	"is_aktif" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pg-drizzle_ruangan" (
	"id" text PRIMARY KEY NOT NULL,
	"gedung_id" text NOT NULL,
	"nama" text NOT NULL,
	"status" text DEFAULT 'Normal' NOT NULL,
	"efisiensi_score" integer DEFAULT 100 NOT NULL,
	"suhu" real,
	"kelembapan" real,
	"ada_orang" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pg-drizzle_gedung" ADD CONSTRAINT "pg-drizzle_gedung_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pg-drizzle_log_konsumsi" ADD CONSTRAINT "pg-drizzle_log_konsumsi_ruangan_id_pg-drizzle_ruangan_id_fk" FOREIGN KEY ("ruangan_id") REFERENCES "public"."pg-drizzle_ruangan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pg-drizzle_notifikasi" ADD CONSTRAINT "pg-drizzle_notifikasi_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pg-drizzle_notifikasi" ADD CONSTRAINT "pg-drizzle_notifikasi_ruangan_id_pg-drizzle_ruangan_id_fk" FOREIGN KEY ("ruangan_id") REFERENCES "public"."pg-drizzle_ruangan"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pg-drizzle_perangkat" ADD CONSTRAINT "pg-drizzle_perangkat_ruangan_id_pg-drizzle_ruangan_id_fk" FOREIGN KEY ("ruangan_id") REFERENCES "public"."pg-drizzle_ruangan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pg-drizzle_ruangan" ADD CONSTRAINT "pg-drizzle_ruangan_gedung_id_pg-drizzle_gedung_id_fk" FOREIGN KEY ("gedung_id") REFERENCES "public"."pg-drizzle_gedung"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gedung_user_id_idx" ON "pg-drizzle_gedung" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "log_ruangan_id_idx" ON "pg-drizzle_log_konsumsi" USING btree ("ruangan_id");--> statement-breakpoint
CREATE INDEX "log_timestamp_idx" ON "pg-drizzle_log_konsumsi" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "notif_user_id_idx" ON "pg-drizzle_notifikasi" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notif_ruangan_id_idx" ON "pg-drizzle_notifikasi" USING btree ("ruangan_id");--> statement-breakpoint
CREATE INDEX "perangkat_ruangan_id_idx" ON "pg-drizzle_perangkat" USING btree ("ruangan_id");--> statement-breakpoint
CREATE INDEX "ruangan_gedung_id_idx" ON "pg-drizzle_ruangan" USING btree ("gedung_id");
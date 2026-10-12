ALTER TABLE "pg-drizzle_perangkat" ADD COLUMN "api_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pg-drizzle_perangkat" DROP COLUMN "tipe";--> statement-breakpoint
ALTER TABLE "pg-drizzle_perangkat" ADD CONSTRAINT "pg-drizzle_perangkat_api_key_unique" UNIQUE("api_key");
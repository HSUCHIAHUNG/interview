CREATE TABLE "flashcard_folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flashcard_decks" ADD COLUMN "folder_id" integer;--> statement-breakpoint
CREATE INDEX "flashcard_folders_user_id_idx" ON "flashcard_folders" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "flashcard_decks" ADD CONSTRAINT "flashcard_decks_folder_id_flashcard_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."flashcard_folders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "flashcard_decks_folder_id_idx" ON "flashcard_decks" USING btree ("folder_id");
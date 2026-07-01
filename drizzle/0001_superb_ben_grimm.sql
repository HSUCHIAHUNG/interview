CREATE TABLE "user_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"topic_slug" text NOT NULL,
	"mode" text NOT NULL,
	"current_question" integer DEFAULT 0 NOT NULL,
	"quiz_answers" jsonb,
	"completed_ids" jsonb DEFAULT '[]'::jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_progress_uniq" UNIQUE("clerk_id","topic_slug","mode")
);

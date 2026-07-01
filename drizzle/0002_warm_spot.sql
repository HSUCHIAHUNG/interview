CREATE TABLE "user_topic_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"topic_slug" text NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_topic_completion_uniq" UNIQUE("clerk_id","topic_slug")
);

CREATE TABLE "topic_note_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"heading" text NOT NULL,
	"content" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_daily_focus" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" text NOT NULL,
	"seconds" integer DEFAULT 0 NOT NULL,
	"leave_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_daily_focus_uniq" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "user_daily_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_daily_notes_uniq" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "user_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_notes_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_question_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"topic_slug" text NOT NULL,
	"mode" text NOT NULL,
	"logged_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_starred_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"topic_slug" text NOT NULL,
	"problem_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_starred_problem_uniq" UNIQUE("user_id","topic_slug","problem_id")
);
--> statement-breakpoint
CREATE TABLE "user_starred_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"question_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_starred_q_uniq" UNIQUE("user_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "user_todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"data" jsonb DEFAULT '{"sections":[]}'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_todos_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_week_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"week_start" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_week_notes_uniq" UNIQUE("user_id","week_start")
);
--> statement-breakpoint
CREATE TABLE "user_weekly_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"theme" text NOT NULL,
	"weekly_goal" integer DEFAULT 0 NOT NULL,
	"target_days" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_weekly_goals_uniq" UNIQUE("user_id","theme")
);
--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_starred_questions" ADD CONSTRAINT "user_starred_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_topic_id_order_uniq" UNIQUE("topic_id","order");
CREATE TABLE "method_key_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

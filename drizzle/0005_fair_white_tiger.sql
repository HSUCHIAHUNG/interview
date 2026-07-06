CREATE TABLE "theme_sub_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"theme" text NOT NULL,
	"name" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "theme_sub_category_uniq" UNIQUE("theme","name")
);

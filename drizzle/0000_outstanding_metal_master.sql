CREATE TABLE "photos" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"thumbnail_url" text,
	"camera_model" varchar(128),
	"lens_model" varchar(128),
	"focal_length" varchar(64),
	"aperture" varchar(64),
	"shutter_speed" varchar(64),
	"iso" integer,
	"locomotive" varchar(128) NOT NULL,
	"train_name" varchar(128),
	"location" varchar(255) NOT NULL,
	"region" varchar(128) NOT NULL,
	"date_taken" varchar(64) NOT NULL,
	"year" integer,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"aspect_ratio" varchar(32) DEFAULT '16:9',
	"featured" boolean DEFAULT false,
	"time_weather" varchar(64),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" varchar(64) PRIMARY KEY DEFAULT 'main' NOT NULL,
	"brand" jsonb NOT NULL,
	"hero" jsonb NOT NULL,
	"about" jsonb NOT NULL,
	"categories" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now()
);

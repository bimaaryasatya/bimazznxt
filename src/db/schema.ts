import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  BrandContent,
  HeroContent,
  CollageContent,
  AboutContent,
  CategoryContent,
  FooterContent,
} from "@/lib/siteContent";

/**
 * Photos Table - Stores all railway documentary photographs and EXIF metadata
 */
export const photos = pgTable("photos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  cameraModel: varchar("camera_model", { length: 128 }),
  lensModel: varchar("lens_model", { length: 128 }),
  focalLength: varchar("focal_length", { length: 64 }),
  aperture: varchar("aperture", { length: 64 }),
  shutterSpeed: varchar("shutter_speed", { length: 64 }),
  iso: integer("iso"),
  locomotive: varchar("locomotive", { length: 128 }).notNull(),
  trainName: varchar("train_name", { length: 128 }),
  location: varchar("location", { length: 255 }).notNull(),
  region: varchar("region", { length: 128 }).notNull(),
  dateTaken: varchar("date_taken", { length: 64 }).notNull(),
  year: integer("year"),
  tags: jsonb("tags").$type<string[]>().default([]),
  aspectRatio: varchar("aspect_ratio", { length: 32 }).default("16:9"),
  featured: boolean("featured").default(false),
  timeWeather: varchar("time_weather", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Site Content Table - Stores dynamic CMS content (Brand, Hero, About, Gear, Categories)
 */
export const siteContent = pgTable("site_content", {
  id: varchar("id", { length: 64 }).primaryKey().default("main"),
  brand: jsonb("brand").$type<BrandContent>().notNull(),
  hero: jsonb("hero").$type<HeroContent>().notNull(),
  collage: jsonb("collage").$type<CollageContent>(),
  about: jsonb("about").$type<AboutContent>().notNull(),
  categories: jsonb("categories").$type<CategoryContent>().notNull(),
  footer: jsonb("footer").$type<FooterContent>(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PhotoRecord = typeof photos.$inferSelect;
export type NewPhotoRecord = typeof photos.$inferInsert;
export type SiteContentRecord = typeof siteContent.$inferSelect;
export type NewSiteContentRecord = typeof siteContent.$inferInsert;

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc } from "drizzle-orm";
import * as schema from "./schema";
import { Photo, FilterState } from "@/lib/types";
import { SiteContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { INITIAL_PHOTOS } from "@/lib/data";
import fs from "fs";
import path from "path";

// Initialize PostgreSQL connection client with connection pooling
const connectionString = process.env.DATABASE_URL;

let drizzleDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (connectionString && connectionString.trim() !== "" && connectionString.includes("postgres")) {
  try {
    const client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 4, // 4s timeout for fast fallback
      prepare: false, // Recommended for Supabase transaction pooler (port 6543)
    });
    drizzleDb = drizzle(client, { schema });
  } catch (error) {
    console.warn("[Drizzle] Could not initialize postgres client:", error);
  }
}

export const db = drizzleDb;
export const isDrizzleActive = Boolean(drizzleDb);

// High-speed in-memory caches to eliminate Supabase query roundtrips on repeated visits
let memoryPhotosCache: Photo[] | null = null;
let memoryPhotosCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

export function invalidatePhotosCache() {
  memoryPhotosCache = null;
  memoryPhotosCacheTime = 0;
}

let memoryContentCache: SiteContent | null = null;
let memoryContentCacheTime = 0;

export function invalidateContentCache() {
  memoryContentCache = null;
  memoryContentCacheTime = 0;
}

// Fallback local JSON storage paths (active when DATABASE_URL is not provided)
const DATA_DIR = path.join(process.cwd(), ".data");
const PHOTOS_FILE = path.join(DATA_DIR, "photos.json");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

function ensureLocalPhotos(): Photo[] {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(PHOTOS_FILE)) {
      fs.writeFileSync(PHOTOS_FILE, JSON.stringify(INITIAL_PHOTOS, null, 2), "utf-8");
      return INITIAL_PHOTOS;
    }
    const raw = fs.readFileSync(PHOTOS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PHOTOS;
  } catch {
    return INITIAL_PHOTOS;
  }
}

function writeLocalPhotos(photos: Photo[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2), "utf-8");
  } catch (err) {
    console.error("Local photos write error:", err);
  }
}

function ensureLocalContent(): SiteContent {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(CONTENT_FILE)) {
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), "utf-8");
      return DEFAULT_SITE_CONTENT;
    }
    const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      brand: { ...DEFAULT_SITE_CONTENT.brand, ...(parsed.brand || {}) },
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
      collage: { ...DEFAULT_SITE_CONTENT.collage, ...(parsed.collage || {}) },
      about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
      categories: { ...DEFAULT_SITE_CONTENT.categories, ...(parsed.categories || {}) },
      footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer || {}) },
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

function writeLocalContent(content: SiteContent): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
  } catch (err) {
    console.error("Local content write error:", err);
  }
}

// ============================================================================
// PHOTO DATA ACCESS LAYER (DRIZZLE ORM with fallback)
// ============================================================================

export async function getAllPhotosFromDb(filters?: Partial<FilterState>): Promise<Photo[]> {
  const now = Date.now();
  let baseList: Photo[] | null = null;

  if (memoryPhotosCache && now - memoryPhotosCacheTime < CACHE_TTL_MS) {
    baseList = memoryPhotosCache;
  } else if (drizzleDb) {
    try {
      const records = await drizzleDb
        .select()
        .from(schema.photos)
        .orderBy(desc(schema.photos.createdAt));

      baseList = records.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description || "",
        imageUrl: r.imageUrl,
        thumbnailUrl: r.thumbnailUrl || undefined,
        cameraModel: r.cameraModel || "Unknown Camera",
        lens: r.lensModel || "Unknown Lens",
        focalLength: r.focalLength || "50mm",
        aperture: r.aperture || "f/2.8",
        shutterSpeed: r.shutterSpeed || "1/1000s",
        iso: r.iso ? String(r.iso) : "100",
        locomotive: r.locomotive,
        trainName: r.trainName || "",
        location: r.location,
        region: r.region,
        dateTaken: r.dateTaken,
        year: r.year || new Date(r.dateTaken).getFullYear() || 2024,
        tags: (r.tags as string[]) || [],
        aspectRatio: (r.aspectRatio as Photo["aspectRatio"]) || "landscape",
        isFeatured: r.featured || false,
        timeWeather: (r.timeWeather as Photo["timeWeather"]) || "Daylight",
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
      }));

      memoryPhotosCache = baseList;
      memoryPhotosCacheTime = now;
    } catch (err) {
      console.error("[Drizzle Error] Failed to query photos:", err);
    }
  }

  if (!baseList) {
    baseList = ensureLocalPhotos();
  }

  let result = baseList;
  if (!filters) return result;

  // Apply in-memory filtering if filter criteria provided
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter((p) =>
      [p.title, p.description, p.locomotive, p.trainName, p.location, p.region, p.cameraModel, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }
  if (filters.locomotive && filters.locomotive !== "all") {
    result = result.filter((p) => p.locomotive.toLowerCase() === filters.locomotive!.toLowerCase());
  }
  if (filters.region && filters.region !== "all") {
    result = result.filter(
      (p) =>
        (p.region?.toLowerCase().includes(filters.region!.toLowerCase()) ?? false) ||
        p.location.toLowerCase().includes(filters.region!.toLowerCase())
    );
  }
  if (filters.weather && filters.weather !== "all") {
    result = result.filter(
      (p) =>
        p.timeWeather?.toLowerCase() === filters.weather!.toLowerCase() ||
        p.tags.some((t) => t.toLowerCase() === filters.weather!.toLowerCase())
    );
  }
  return result;
}

export async function insertPhotoToDb(photo: Photo): Promise<Photo> {
  if (drizzleDb) {
    try {
      await drizzleDb.insert(schema.photos).values({
        id: photo.id,
        title: photo.title,
        description: photo.description,
        imageUrl: photo.imageUrl,
        thumbnailUrl: photo.thumbnailUrl,
        cameraModel: photo.cameraModel,
        lensModel: photo.lens || "",
        focalLength: photo.focalLength,
        aperture: photo.aperture,
        shutterSpeed: photo.shutterSpeed,
        iso: photo.iso ? parseInt(String(photo.iso).replace(/\D/g, ""), 10) || null : null,
        locomotive: photo.locomotive,
        trainName: photo.trainName,
        location: photo.location,
        region: photo.region || "Daop 1 Jakarta",
        dateTaken: photo.dateTaken,
        year: photo.year,
        tags: photo.tags,
        aspectRatio: photo.aspectRatio,
        featured: photo.isFeatured || false,
        timeWeather: photo.timeWeather,
      });
      invalidatePhotosCache();
      return photo;
    } catch (err) {
      console.error("[Drizzle Error] Insert photo failed:", err);
    }
  }

  // Local fallback
  const photos = ensureLocalPhotos();
  photos.unshift(photo);
  writeLocalPhotos(photos);
  invalidatePhotosCache();
  return photo;
}

export async function updatePhotoInDb(id: string, updates: Partial<Photo>): Promise<Photo | null> {
  if (drizzleDb) {
    try {
      await drizzleDb
        .update(schema.photos)
        .set({
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl }),
          ...(updates.thumbnailUrl !== undefined && { thumbnailUrl: updates.thumbnailUrl }),
          ...(updates.cameraModel !== undefined && { cameraModel: updates.cameraModel }),
          ...(updates.lens !== undefined && { lensModel: updates.lens }),
          ...(updates.focalLength !== undefined && { focalLength: updates.focalLength }),
          ...(updates.aperture !== undefined && { aperture: updates.aperture }),
          ...(updates.shutterSpeed !== undefined && { shutterSpeed: updates.shutterSpeed }),
          ...(updates.iso !== undefined && {
            iso: updates.iso ? parseInt(String(updates.iso).replace(/\D/g, ""), 10) || null : null,
          }),
          ...(updates.locomotive !== undefined && { locomotive: updates.locomotive }),
          ...(updates.trainName !== undefined && { trainName: updates.trainName }),
          ...(updates.location !== undefined && { location: updates.location }),
          ...(updates.region !== undefined && { region: updates.region }),
          ...(updates.dateTaken !== undefined && { dateTaken: updates.dateTaken }),
          ...(updates.year !== undefined && { year: updates.year }),
          ...(updates.tags !== undefined && { tags: updates.tags }),
          ...(updates.aspectRatio !== undefined && { aspectRatio: updates.aspectRatio }),
          ...(updates.isFeatured !== undefined && { featured: updates.isFeatured }),
          ...(updates.timeWeather !== undefined && { timeWeather: updates.timeWeather }),
        })
        .where(eq(schema.photos.id, id));

      const [updated] = await drizzleDb.select().from(schema.photos).where(eq(schema.photos.id, id));
      if (updated) {
        invalidatePhotosCache();
        return {
          id: updated.id,
          title: updated.title,
          description: updated.description || "",
          imageUrl: updated.imageUrl,
          thumbnailUrl: updated.thumbnailUrl || undefined,
          cameraModel: updated.cameraModel || "",
          lens: updated.lensModel || "",
          focalLength: updated.focalLength || "",
          aperture: updated.aperture || "",
          shutterSpeed: updated.shutterSpeed || "",
          iso: updated.iso ? String(updated.iso) : "100",
          locomotive: updated.locomotive,
          trainName: updated.trainName || "",
          location: updated.location,
          region: updated.region,
          dateTaken: updated.dateTaken,
          year: updated.year || 2024,
          tags: (updated.tags as string[]) || [],
          aspectRatio: (updated.aspectRatio as Photo["aspectRatio"]) || "landscape",
          isFeatured: updated.featured || false,
          timeWeather: (updated.timeWeather as Photo["timeWeather"]) || "Daylight",
          createdAt: updated.createdAt ? updated.createdAt.toISOString() : new Date().toISOString(),
        };
      }
    } catch (err) {
      console.error("[Drizzle Error] Update photo failed:", err);
    }
  }

  // Local fallback
  const photos = ensureLocalPhotos();
  const idx = photos.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  photos[idx] = { ...photos[idx], ...updates };
  writeLocalPhotos(photos);
  invalidatePhotosCache();
  return photos[idx];
}

export async function deletePhotoFromDb(id: string): Promise<boolean> {
  if (drizzleDb) {
    try {
      await drizzleDb.delete(schema.photos).where(eq(schema.photos.id, id));
      invalidatePhotosCache();
      return true;
    } catch (err) {
      console.error("[Drizzle Error] Delete photo failed:", err);
    }
  }

  // Local fallback
  const photos = ensureLocalPhotos();
  const filtered = photos.filter((p) => p.id !== id);
  if (filtered.length !== photos.length) {
    writeLocalPhotos(filtered);
    invalidatePhotosCache();
    return true;
  }
  return false;
}

// ============================================================================
// SITE CONTENT DATA ACCESS LAYER (DRIZZLE ORM with fallback)
// ============================================================================

export async function getSiteContentFromDb(): Promise<SiteContent> {
  const now = Date.now();
  if (memoryContentCache && now - memoryContentCacheTime < CACHE_TTL_MS) {
    return memoryContentCache;
  }

  if (drizzleDb) {
    try {
      const records = await drizzleDb
        .select()
        .from(schema.siteContent)
        .where(eq(schema.siteContent.id, "main"));

      if (records.length > 0) {
        const row = records[0];
        const res: SiteContent = {
          brand: { ...DEFAULT_SITE_CONTENT.brand, ...(row.brand || {}) },
          hero: { ...DEFAULT_SITE_CONTENT.hero, ...(row.hero || {}) },
          collage: { ...DEFAULT_SITE_CONTENT.collage, ...(row.collage || {}) },
          about: { ...DEFAULT_SITE_CONTENT.about, ...(row.about || {}) },
          categories: { ...DEFAULT_SITE_CONTENT.categories, ...(row.categories || {}) },
          footer: { ...DEFAULT_SITE_CONTENT.footer, ...(row.footer || {}) },
        };
        memoryContentCache = res;
        memoryContentCacheTime = now;
        return res;
      } else {
        // Seed default row if empty
        await drizzleDb.insert(schema.siteContent).values({
          id: "main",
          brand: DEFAULT_SITE_CONTENT.brand,
          hero: DEFAULT_SITE_CONTENT.hero,
          collage: DEFAULT_SITE_CONTENT.collage,
          about: DEFAULT_SITE_CONTENT.about,
          categories: DEFAULT_SITE_CONTENT.categories,
          footer: DEFAULT_SITE_CONTENT.footer,
        });
        memoryContentCache = DEFAULT_SITE_CONTENT;
        memoryContentCacheTime = now;
        return DEFAULT_SITE_CONTENT;
      }
    } catch (err) {
      console.error("[Drizzle Error] Get site content failed:", err);
    }
  }

  const local = ensureLocalContent();
  memoryContentCache = local;
  memoryContentCacheTime = now;
  return local;
}

export async function updateSiteContentInDb(updates: Partial<SiteContent>): Promise<SiteContent> {
  invalidateContentCache();
  if (drizzleDb) {
    try {
      const current = await getSiteContentFromDb();
      const updated: SiteContent = {
        brand: updates.brand ? { ...current.brand, ...updates.brand } : current.brand,
        hero: updates.hero ? { ...current.hero, ...updates.hero } : current.hero,
        collage: updates.collage ? { ...current.collage, ...updates.collage } : current.collage,
        about: updates.about ? { ...current.about, ...updates.about } : current.about,
        categories: updates.categories ? { ...current.categories, ...updates.categories } : current.categories,
        footer: updates.footer ? { ...current.footer, ...updates.footer } : current.footer,
      };

      await drizzleDb
        .insert(schema.siteContent)
        .values({
          id: "main",
          brand: updated.brand,
          hero: updated.hero,
          collage: updated.collage,
          about: updated.about,
          categories: updated.categories,
          footer: updated.footer,
        })
        .onConflictDoUpdate({
          target: schema.siteContent.id,
          set: {
            brand: updated.brand,
            hero: updated.hero,
            collage: updated.collage,
            about: updated.about,
            categories: updated.categories,
            footer: updated.footer,
            updatedAt: new Date(),
          },
        });

      memoryContentCache = updated;
      memoryContentCacheTime = Date.now();
      return updated;
    } catch (err) {
      console.error("[Drizzle Error] Update site content failed:", err);
    }
  }

  const current = ensureLocalContent();
  const updated: SiteContent = {
    brand: updates.brand ? { ...current.brand, ...updates.brand } : current.brand,
    hero: updates.hero ? { ...current.hero, ...updates.hero } : current.hero,
    collage: updates.collage ? { ...current.collage, ...updates.collage } : current.collage,
    about: updates.about ? { ...current.about, ...updates.about } : current.about,
    categories: updates.categories ? { ...current.categories, ...updates.categories } : current.categories,
    footer: updates.footer ? { ...current.footer, ...updates.footer } : current.footer,
  };
  writeLocalContent(updated);
  memoryContentCache = updated;
  memoryContentCacheTime = Date.now();
  return updated;
}

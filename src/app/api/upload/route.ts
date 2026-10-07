import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase, SUPABASE_BUCKET_NAME } from "@/lib/supabase";
import fs from "fs";
import path from "path";
import exifr from "exifr";

export async function POST(req: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".jpg";
    const cleanBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const filename = `${Date.now()}_${cleanBase}${ext}`;

    let publicUrl = "";

    // 1. Try Supabase Storage first if configured
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(SUPABASE_BUCKET_NAME)
          .upload(filename, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicData } = supabase.storage
            .from(SUPABASE_BUCKET_NAME)
            .getPublicUrl(filename);
          publicUrl = publicData.publicUrl;
        } else {
          console.warn("[Supabase Storage] Upload error, falling back to local:", uploadError.message);
        }
      } catch (err) {
        console.warn("[Supabase Storage] Exception, falling back to local:", err);
      }
    }

    // 2. Fallback to local public/uploads if Supabase Storage is not configured or failed
    if (!publicUrl) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
    }

    // Server-side fallback EXIF extraction
    let serverExif = null;
    try {
      const parsed = await exifr.parse(buffer, {
        tiff: true,
        exif: true,
        gps: true,
        reviveValues: true,
      });
      if (parsed) {
        serverExif = {
          cameraModel: parsed.Model ? (parsed.Make ? `${parsed.Make} ${parsed.Model}` : parsed.Model) : undefined,
          lens: parsed.LensModel || parsed.Lens || undefined,
          focalLength: parsed.FocalLength ? `${Math.round(parsed.FocalLength)}mm` : undefined,
          aperture: parsed.FNumber ? `f/${parsed.FNumber.toFixed(1)}` : undefined,
          shutterSpeed: parsed.ExposureTime ? (parsed.ExposureTime < 1 ? `1/${Math.round(1 / parsed.ExposureTime)}s` : `${parsed.ExposureTime}s`) : undefined,
          iso: parsed.ISO ? `ISO ${parsed.ISO}` : undefined,
          dateTaken: parsed.DateTimeOriginal ? new Date(parsed.DateTimeOriginal).toISOString() : undefined,
        };
      }
    } catch (e) {
      console.warn("Server EXIF parse error:", e);
    }

    return NextResponse.json({
      url: publicUrl,
      filename,
      size: file.size,
      serverExif,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}

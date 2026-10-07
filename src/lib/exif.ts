import exifr from "exifr";
import { ExifParsedData } from "./types";

/**
 * Format shutter speed into human-readable fraction e.g. 1/800s or 2s
 */
export function formatShutterSpeed(seconds?: number): string | undefined {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return undefined;

  if (seconds >= 1) {
    return `${Number(seconds.toFixed(1))}s`;
  }

  // Fractional shutter speed
  const denominator = Math.round(1 / seconds);
  return `1/${denominator}s`;
}

/**
 * Format aperture number into f/number e.g. f/2.8 or f/4.0
 */
export function formatAperture(fNumber?: number): string | undefined {
  if (fNumber === undefined || fNumber === null || isNaN(fNumber)) return undefined;
  return `f/${fNumber.toFixed(1)}`;
}

/**
 * Format focal length e.g. 70mm
 */
export function formatFocalLength(focalLength?: number): string | undefined {
  if (focalLength === undefined || focalLength === null || isNaN(focalLength)) return undefined;
  return `${Math.round(focalLength)}mm`;
}

/**
 * Format date to datetime-local input format (YYYY-MM-DDTHH:mm)
 */
export function formatToDatetimeLocal(dateInput?: Date | string | number): string | undefined {
  if (!dateInput) return undefined;
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return undefined;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return undefined;
  }
}

/**
 * Parse EXIF metadata directly from a File or ArrayBuffer using exifr
 */
export async function parseImageExif(file: File | Blob | ArrayBuffer): Promise<ExifParsedData> {
  try {
    const data = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      reviveValues: true,
      translateKeys: true,
      translateValues: true,
    });

    if (!data) {
      return {};
    }

    // Camera Make & Model
    let cameraModel: string | undefined = undefined;
    const make = (data.Make || "").trim();
    const model = (data.Model || "").trim();

    if (make && model) {
      if (model.toLowerCase().includes(make.toLowerCase())) {
        cameraModel = model;
      } else {
        cameraModel = `${make} ${model}`;
      }
    } else if (model) {
      cameraModel = model;
    } else if (make) {
      cameraModel = make;
    }

    // Lens
    const lens = data.LensModel || data.Lens || data.LensInfo || undefined;

    // Focal length
    const focalLength = formatFocalLength(data.FocalLengthIn35mmFormat || data.FocalLength);

    // Aperture
    const aperture = formatAperture(data.FNumber || data.ApertureValue);

    // Shutter speed
    const shutterSpeed = formatShutterSpeed(data.ExposureTime);

    // ISO
    const isoVal = data.ISO || data.ISOSpeedRatings;
    const iso = isoVal ? `ISO ${isoVal}` : undefined;

    // Date Taken
    const rawDate = data.DateTimeOriginal || data.CreateDate || data.ModifyDate;
    const dateTaken = formatToDatetimeLocal(rawDate);

    // GPS
    const latitude = data.latitude;
    const longitude = data.longitude;

    return {
      cameraModel,
      lens,
      focalLength,
      aperture,
      shutterSpeed,
      iso,
      dateTaken,
      latitude,
      longitude,
    };
  } catch (error) {
    console.warn("Could not extract EXIF metadata:", error);
    return {};
  }
}

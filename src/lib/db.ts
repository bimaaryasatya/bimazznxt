import { Photo, FilterState } from "./types";
import { INITIAL_PHOTOS } from "./data";
import {
  getAllPhotosFromDb,
  insertPhotoToDb,
  updatePhotoInDb,
  deletePhotoFromDb,
} from "@/db";

export async function getPhotos(filters?: Partial<FilterState>): Promise<Photo[]> {
  return getAllPhotosFromDb(filters);
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  const all = await getAllPhotosFromDb();
  return all.find((p) => p.id === id) || null;
}

export async function createPhoto(
  data: Omit<Photo, "id" | "createdAt"> & { id?: string; createdAt?: string }
): Promise<Photo> {
  const newPhoto: Photo = {
    ...data,
    id: data.id || `rail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: data.createdAt || new Date().toISOString(),
    year: data.year || (data.dateTaken ? new Date(data.dateTaken).getFullYear() : new Date().getFullYear()),
  };

  return insertPhotoToDb(newPhoto);
}

export async function updatePhoto(id: string, updates: Partial<Photo>): Promise<Photo | null> {
  return updatePhotoInDb(id, updates);
}

export async function deletePhoto(id: string): Promise<boolean> {
  return deletePhotoFromDb(id);
}

export async function resetToDefaultPhotos(): Promise<Photo[]> {
  for (const photo of INITIAL_PHOTOS) {
    await insertPhotoToDb(photo);
  }
  return INITIAL_PHOTOS;
}

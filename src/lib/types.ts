export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  locomotive: string; // e.g. "CC 201", "CC 203", "CC 206", "Vintage"
  trainName?: string; // e.g. "Argo Bromo Anggrek", "Taksaka", "Sawunggalih"
  location: string; // e.g. "Jembatan Sakalibel, Bumiayu"
  region?: string; // e.g. "Daop 5 Purwokerto", "Daop 2 Bandung"
  dateTaken: string; // ISO 8601 string
  year?: number;
  timeWeather?: "Golden Hour" | "Night" | "Rainy" | "Overcast" | "Daylight";
  tags: string[];
  cameraModel?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  isFeatured?: boolean;
  aspectRatio?: "landscape" | "portrait" | "wide";
  createdAt: string;
}

export type FilterCategory = "all" | "locomotive" | "region" | "year" | "weather";

export interface FilterState {
  searchQuery: string;
  locomotive: string;
  region: string;
  year: string;
  weather: string;
}

export interface ExifParsedData {
  cameraModel?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  dateTaken?: string;
  latitude?: number;
  longitude?: number;
}

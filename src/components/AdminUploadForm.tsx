"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { parseImageExif } from "@/lib/exif";
import { Photo } from "@/lib/types";
import {
  UploadCloud,
  FileImage,
  Camera,
  Train,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
  Aperture,
  Clock,
  Gauge,
  Layers,
  Tag,
  Loader2,
  Sliders,
} from "lucide-react";

interface AdminUploadFormProps {
  onPhotoCreated: (photo: Photo) => void;
}

export function AdminUploadForm({ onPhotoCreated }: AdminUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsingExif, setIsParsingExif] = useState(false);
  const [exifExtracted, setExifExtracted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    locomotive: "CC 206",
    customLocomotive: "",
    trainName: "",
    location: "",
    region: "Daop 5 Purwokerto",
    dateTaken: new Date().toISOString().slice(0, 16),
    timeWeather: "Golden Hour" as const,
    tagsInput: "CC 206, Golden Hour, Mainline",
    cameraModel: "",
    lens: "",
    focalLength: "",
    aperture: "",
    shutterSpeed: "",
    iso: "",
    isFeatured: false,
  });

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select a valid image file (JPEG, PNG, WebP).",
      });
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Extract EXIF Metadata using exifr client-side
    setIsParsingExif(true);
    try {
      const exif = await parseImageExif(file);

      const updates: Partial<typeof formData> = {};
      let extractedCount = 0;

      if (exif.cameraModel) {
        updates.cameraModel = exif.cameraModel;
        extractedCount++;
      }
      if (exif.lens) {
        updates.lens = exif.lens;
        extractedCount++;
      }
      if (exif.focalLength) {
        updates.focalLength = exif.focalLength;
        extractedCount++;
      }
      if (exif.aperture) {
        updates.aperture = exif.aperture;
        extractedCount++;
      }
      if (exif.shutterSpeed) {
        updates.shutterSpeed = exif.shutterSpeed;
        extractedCount++;
      }
      if (exif.iso) {
        updates.iso = exif.iso;
        extractedCount++;
      }
      if (exif.dateTaken) {
        updates.dateTaken = exif.dateTaken;
        extractedCount++;
      }

      setFormData((prev) => ({
        ...prev,
        ...updates,
        // Auto-suggest title if empty
        title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      }));

      if (extractedCount > 0) {
        setExifExtracted(true);
        toast.success("EXIF metadata extracted successfully", {
          description: `Extracted ${extractedCount} technical parameters: ${updates.cameraModel || "Camera"} • ${updates.aperture || ""} • ${updates.shutterSpeed || ""}`,
        });
      } else {
        toast.info("No embedded EXIF data found", {
          description: "You can enter camera and lens specs manually below.",
        });
      }
    } catch (err) {
      console.error("EXIF error:", err);
      toast.error("Failed to read EXIF tags", {
        description: "Standard parameters can still be filled manually.",
      });
    } finally {
      setIsParsingExif(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    if (!previewUrl && !formData.imageUrl) {
      toast.error("Image is required", {
        description: "Please upload a photo file or provide an image URL.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;

      // If a file was selected, upload via /api/upload
      if (selectedFile) {
        const uploadBody = new FormData();
        uploadBody.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadBody,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image file to server");
        }

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      // Format tags
      const tagsArray = formData.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const locomotiveVal =
        formData.locomotive === "Custom"
          ? formData.customLocomotive || "Diesel"
          : formData.locomotive;

      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        imageUrl: finalImageUrl,
        thumbnailUrl: finalImageUrl,
        locomotive: locomotiveVal,
        trainName: formData.trainName || undefined,
        location: formData.location || "Java Mainline",
        region: formData.region,
        dateTaken: new Date(formData.dateTaken).toISOString(),
        timeWeather: formData.timeWeather,
        tags: tagsArray,
        cameraModel: formData.cameraModel || undefined,
        lens: formData.lens || undefined,
        focalLength: formData.focalLength || undefined,
        aperture: formData.aperture || undefined,
        shutterSpeed: formData.shutterSpeed || undefined,
        iso: formData.iso || undefined,
        isFeatured: formData.isFeatured,
      };

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create photo record");
      }

      const { photo } = await res.json();
      toast.success("Photograph cataloged successfully!", {
        description: `${photo.title} added to railway archive.`,
      });

      onPhotoCreated(photo);

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setExifExtracted(false);
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        locomotive: "CC 206",
        customLocomotive: "",
        trainName: "",
        location: "",
        region: "Daop 5 Purwokerto",
        dateTaken: new Date().toISOString().slice(0, 16),
        timeWeather: "Golden Hour",
        tagsInput: "CC 206, Golden Hour, Mainline",
        cameraModel: "",
        lens: "",
        focalLength: "",
        aperture: "",
        shutterSpeed: "",
        iso: "",
        isFeatured: false,
      });
    } catch (error: any) {
      toast.error("Upload error", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
            : previewUrl
            ? "border-white/20 bg-white/[0.02]"
            : "border-white/10 hover:border-indigo-500/40 bg-white/[0.01] hover:bg-white/[0.03]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/tiff"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        {previewUrl ? (
          <div className="flex flex-col sm:flex-row items-center gap-6 text-left">
            <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-black">
              <Image
                src={previewUrl}
                alt="Upload preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setExifExtracted(false);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-zinc-100 text-sm">
                  {selectedFile?.name || "Image ready"}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  ({((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>

              {isParsingExif ? (
                <div className="flex items-center gap-2 text-xs text-indigo-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Reading EXIF metadata directly from image headers...
                </div>
              ) : exifExtracted ? (
                <div className="text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg inline-block">
                  ✓ EXIF metadata extracted and mapped to form fields below
                </div>
              ) : (
                <p className="text-xs text-zinc-400">
                  Click to replace image file or drag a new one.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-200">
                Pilih atau seret file foto ke sini
              </p>
              <p className="text-[11px] text-zinc-400 font-mono mt-1">
                JPG, PNG, WebP, TIFF (maks 50MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Railway & Archive Details */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
          <Train className="w-4 h-4 text-indigo-400" />
          Detail Foto &amp; Kereta
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Photo Title */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Photograph Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Twin Arches of Sakalibel at Dusk"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Locomotive Series */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Locomotive Class *
            </label>
            <select
              value={formData.locomotive}
              onChange={(e) =>
                setFormData({ ...formData, locomotive: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-white/10 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/60"
            >
              <option value="CC 206">CC 206 (GE CM20EMP)</option>
              <option value="CC 201">CC 201 (GE U18C)</option>
              <option value="CC 203">CC 203 (GE U20C)</option>
              <option value="CC 205">CC 205 (EMD GT38AC)</option>
              <option value="Vintage">Vintage / Heritage / Steam</option>
              <option value="Custom">Other Custom Locomotive</option>
            </select>
          </div>

          {/* Train Service Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Train Name / Service (KA)
            </label>
            <input
              type="text"
              value={formData.trainName}
              onChange={(e) =>
                setFormData({ ...formData, trainName: e.target.value })
              }
              placeholder="e.g. Argo Bromo Anggrek / Sawunggalih"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Spot Location */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Spot Location / Milepost *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Jembatan Sakalibel, Bumiayu"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Daop Region */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Operational Region (Daop)
            </label>
            <select
              value={formData.region}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-white/10 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/60"
            >
              <option value="Daop 1 Jakarta">Daop 1 Jakarta</option>
              <option value="Daop 2 Bandung">Daop 2 Bandung</option>
              <option value="Daop 3 Cirebon">Daop 3 Cirebon</option>
              <option value="Daop 4 Semarang">Daop 4 Semarang</option>
              <option value="Daop 5 Purwokerto">Daop 5 Purwokerto</option>
              <option value="Daop 6 Yogyakarta">Daop 6 Yogyakarta</option>
              <option value="Daop 7 Madiun">Daop 7 Madiun</option>
              <option value="Daop 8 Surabaya">Daop 8 Surabaya</option>
              <option value="Daop 9 Jember">Daop 9 Jember</option>
            </select>
          </div>

          {/* Weather / Atmosphere */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Lighting / Atmospheric Condition
            </label>
            <select
              value={formData.timeWeather}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  timeWeather: e.target.value as any,
                })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-white/10 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/60"
            >
              <option value="Golden Hour">Golden Hour (Dusk/Dawn)</option>
              <option value="Night">Night / Platform Glow</option>
              <option value="Rainy">Rainy Season / Monsoon</option>
              <option value="Daylight">Crisp Daylight</option>
              <option value="Overcast">Overcast Moody</option>
            </select>
          </div>

          {/* Date Taken */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Date & Time Captured
            </label>
            <input
              type="datetime-local"
              value={formData.dateTaken}
              onChange={(e) =>
                setFormData({ ...formData, dateTaken: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-white/10 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Deskripsi / Catatan
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Cerita, lokasi spesifik, atau latar belakang foto..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Tags (pisahkan koma)
            </label>
            <input
              type="text"
              value={formData.tagsInput}
              onChange={(e) =>
                setFormData({ ...formData, tagsInput: e.target.value })
              }
              placeholder="CC 206, Golden Hour, Trellis Bridge, Daop 5"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>
      </div>

      {/* 3. EXIF Metadata Technical Specs (Auto-filled by exifr, editable) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
            <Camera className="w-4 h-4 text-cyan-400" />
            Metadata EXIF Kamera
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Camera Model */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              Camera Body
            </label>
            <input
              type="text"
              value={formData.cameraModel}
              onChange={(e) =>
                setFormData({ ...formData, cameraModel: e.target.value })
              }
              placeholder="e.g. Sony ILCE-7M4"
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Lens Model */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Lens Model
            </label>
            <input
              type="text"
              value={formData.lens}
              onChange={(e) =>
                setFormData({ ...formData, lens: e.target.value })
              }
              placeholder="e.g. FE 70-200mm F2.8 GM II"
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Focal Length */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              Focal Length
            </label>
            <input
              type="text"
              value={formData.focalLength}
              onChange={(e) =>
                setFormData({ ...formData, focalLength: e.target.value })
              }
              placeholder="e.g. 105mm"
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Aperture */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 flex items-center gap-1">
              <Aperture className="w-3.5 h-3.5 text-indigo-400" />
              Aperture
            </label>
            <input
              type="text"
              value={formData.aperture}
              onChange={(e) =>
                setFormData({ ...formData, aperture: e.target.value })
              }
              placeholder="e.g. f/4.0"
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Shutter Speed */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Shutter Speed
            </label>
            <input
              type="text"
              value={formData.shutterSpeed}
              onChange={(e) =>
                setFormData({ ...formData, shutterSpeed: e.target.value })
              }
              placeholder="e.g. 1/1000s"
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* ISO */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              ISO
            </label>
            <input
              type="text"
              value={formData.iso}
              onChange={(e) =>
                setFormData({ ...formData, iso: e.target.value })
              }
              placeholder="e.g. ISO 200"
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>
      </div>

      {/* Featured Checkbox & Submit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) =>
              setFormData({ ...formData, isFeatured: e.target.checked })
            }
            className="w-4 h-4 rounded bg-white/[0.05] border-white/10 text-indigo-600 focus:ring-0"
          />
          Feature in Hero Showcase
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Publikasikan Foto
            </>
          )}
        </button>
      </div>
    </form>
  );
}

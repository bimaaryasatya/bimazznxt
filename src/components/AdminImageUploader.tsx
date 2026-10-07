"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2, Link2, Check } from "lucide-react";
import { toast } from "sonner";

interface AdminImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  aspectRatio?: "square" | "video" | "wide" | "auto";
}

export function AdminImageUploader({
  label,
  value,
  onChange,
  helperText,
  aspectRatio = "video",
}: AdminImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file tidak valid", {
        description: "Pilih file gambar JPEG, PNG, atau WebP.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Gagal mengunggah foto ke storage");
      }

      const data = await res.json();
      onChange(data.url);
      setUrlInput(data.url);
      toast.success("Foto berhasil diunggah!", {
        description: data.storage === "supabase" ? "Tersimpan di Supabase Storage CDN" : "Tersimpan di penyimpanan lokal",
      });
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
      toast.success("URL foto diterapkan");
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square max-w-[200px]"
      : aspectRatio === "wide"
      ? "aspect-[21/9]"
      : aspectRatio === "video"
      ? "aspect-[16/9]"
      : "aspect-auto max-h-56";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-cyan-500 dark:hover:text-cyan-400 font-mono flex items-center gap-1 transition-colors"
        >
          <Link2 className="w-3 h-3" />
          {showUrlInput ? "Tutup URL" : "Input URL Langsung"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... atau /uploads/..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-white/10 text-xs text-zinc-800 dark:text-zinc-200 font-sans focus:outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            Terapkan
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative rounded-xl overflow-hidden border border-zinc-300 dark:border-white/15 group bg-zinc-100 dark:bg-zinc-950">
          <div className={`relative w-full ${aspectClass}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Ganti File Foto
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white text-xs shadow-lg transition-transform active:scale-95"
              title="Hapus foto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current URL indicator */}
          <div className="px-3 py-1.5 bg-white/95 dark:bg-black/70 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span className="truncate max-w-[80%] text-zinc-600 dark:text-zinc-400">
              {value}
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 text-[10px] uppercase font-semibold">Aktif</span>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone Box */
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-8 px-4 rounded-xl border border-dashed border-zinc-300 dark:border-white/20 hover:border-cyan-500 dark:hover:border-cyan-400/50 bg-zinc-50 dark:bg-white/[0.02] hover:bg-cyan-500/[0.03] flex flex-col items-center justify-center gap-2.5 transition-all text-center cursor-pointer group"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 text-cyan-500 dark:text-cyan-400 animate-spin" />
              <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                Mengunggah ke Storage Supabase...
              </span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Upload Foto
                </p>
                <p className="text-[10px] text-zinc-400 font-mono">
                  JPG, PNG, WebP
                </p>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );
}

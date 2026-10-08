"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Photo } from "@/lib/types";
import { Expand } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PhotoCardProps {
  photo: Photo;
  onSelect: (photo: Photo) => void;
  index: number;
}

export function PhotoCard({ photo, onSelect, index }: PhotoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: "easeOut",
          },
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(photo)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/25 bg-zinc-950 shadow-md hover:shadow-xl transition-[border-color,box-shadow,transform] duration-300 hover:scale-[1.015] aspect-[16/11] flex flex-col justify-end select-none [transform:translateZ(0)]"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Outer Subtle Edge Glow */}
      <div
        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none z-10 ${
          isHovered ? "opacity-100" : "opacity-0"
        } bg-gradient-to-t from-white/[0.04] via-transparent to-white/[0.02]`}
      />

      {/* Shimmer Placeholder while loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-zinc-900/80 shimmer-mask z-0" />
      )}

      {/* Full-Bleed Photograph Canvas */}
      <Image
        src={photo.thumbnailUrl || photo.imageUrl}
        alt={photo.title}
        fill
        quality={75}
        draggable={false}
        decoding="async"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={`object-cover w-full h-full pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-105 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Hover Inspect Expand Center Trigger (Only mounted when hovered to eliminate 100% of idle backdrop filter overhead during scroll) */}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/35 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-1.5 rounded-full bg-black/85 border border-white/25 text-white text-xs font-medium flex items-center gap-1.5 shadow-xl">
            <Expand className="w-3.5 h-3.5" />
            Inspect EXIF
          </div>
        </div>
      )}

      {/* Bottom Gradient Overlay (Deep Contrast for Crisp Legibility) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-15 pointer-events-none" />

      {/* Minimalist White Text Stacked Directly in Bottom-Left Corner */}
      <div className="relative z-20 p-4 sm:p-5 text-left pointer-events-none photo-text-overlay">
        {/* Train Service & Location */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 mb-1">
          <span className="truncate">{photo.location}</span>
          {photo.trainName && (
            <>
              <span className="text-zinc-500">•</span>
              <span className="text-cyan-300/90 truncate font-semibold">
                KA {photo.trainName}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-sm sm:text-base tracking-tight leading-snug line-clamp-1 group-hover:text-white transition-colors mb-2">
          {photo.title}
        </h3>

        {/* Minimalist EXIF Technical Specs Overlay */}
        <div className="flex items-center justify-between text-[11px] font-mono text-white/90">
          <div className="flex items-center gap-1.5 truncate">
            <span className="truncate">
              {photo.focalLength || "50mm"} • {photo.aperture || "f/2.8"} •{" "}
              {photo.shutterSpeed || "1/1000s"} • ISO {photo.iso || "100"}
            </span>
          </div>

          <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
            {formatDate(photo.dateTaken)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

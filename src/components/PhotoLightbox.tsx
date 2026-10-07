"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Photo } from "@/lib/types";
import {
  X,
  Camera,
  Train,
  MapPin,
  Calendar,
  CloudSun,
  Aperture,
  Gauge,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface PhotoLightboxProps {
  photo: Photo | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const springPhysics = {
  type: "spring" as const,
  damping: 25,
  stiffness: 200,
};

export function PhotoLightbox({
  photo,
  onClose,
  onNext,
  onPrev,
}: PhotoLightboxProps) {
  const { t } = useApp();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {photo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={springPhysics}
            className="photo-lightbox relative z-10 w-full max-w-6xl max-h-[92vh] bg-zinc-950/95 border border-white/10 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl"
          >
            {/* Close Button Top Right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-lg"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left/Center Viewport: High Resolution Photograph */}
            <div className="relative flex-1 min-h-[350px] sm:min-h-[450px] lg:min-h-[620px] bg-black flex items-center justify-center p-2 sm:p-4 group">
              <div className="relative w-full h-full max-h-[82vh] aspect-[16/10]">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-contain"
                />
              </div>

              {/* Prev / Next Floating Navigation */}
              {onPrev && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                  title="Previous photo (←)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {onNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                  title="Next photo (→)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Right Side: Technical Specs & Railway Archive Drawer */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ...springPhysics, delay: 0.1 }}
              className="w-full lg:w-[420px] shrink-0 p-6 sm:p-8 bg-[#09090c]/90 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/[0.08] overflow-y-auto max-h-[92vh] flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header: Locomotive & Weather Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 shadow-sm">
                    <Train className="w-3.5 h-3.5 text-cyan-400" />
                    {photo.locomotive}
                  </span>
                  {photo.timeWeather && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 flex items-center gap-1">
                      <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
                      {photo.timeWeather}
                    </span>
                  )}
                  {photo.region && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {photo.region}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-2">
                    {photo.title}
                  </h2>
                  {photo.trainName && (
                    <div className="text-xs font-mono text-cyan-400 mb-3 flex items-center gap-1">
                      <span>Service:</span>
                      <span className="font-semibold text-cyan-300">
                        KA {photo.trainName}
                      </span>
                    </div>
                  )}
                  {photo.description && (
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                      {photo.description}
                    </p>
                  )}
                </div>

                {/* Railway Location & Trackage Specs */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.07] space-y-2.5">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Field Trackage Location
                  </h4>
                  <div className="text-sm font-medium text-zinc-200">
                    {photo.location}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1 border-t border-white/[0.05]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {formatDate(photo.dateTaken)}
                    </span>
                    <span>{formatDateTime(photo.dateTaken).split(",")[1] || ""}</span>
                  </div>
                </div>

                {/* Camera & Optics EXIF Spec Card */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.07] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-semibold">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      Technical EXIF Specs
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Direct Sensor
                    </span>
                  </div>

                  {/* Body & Lens */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-zinc-200">
                      {photo.cameraModel || "Sony ILCE-7M4"}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      {photo.lens || "FE 70-200mm F2.8 GM OSS II"}
                    </div>
                  </div>

                  {/* Four-Column EXIF Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.05]">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mb-0.5">
                        <Gauge className="w-3 h-3 text-cyan-400" />
                        {t.lightbox.focalLength}
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-100">
                        {photo.focalLength || "70mm"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mb-0.5">
                        <Aperture className="w-3 h-3 text-cyan-400" />
                        {t.lightbox.aperture}
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-100">
                        {photo.aperture || "f/2.8"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mb-0.5">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {t.lightbox.shutterSpeed}
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-100">
                        {photo.shutterSpeed || "1/1000s"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mb-0.5">
                        <Layers className="w-3 h-3 text-cyan-400" />
                        {t.lightbox.iso}
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-100">
                        {photo.iso || "ISO 200"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Tags */}
                {photo.tags && photo.tags.length > 0 && (
                  <div>
                    <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Archive Tags
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {photo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/[0.03] border border-white/[0.08] text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center gap-3">
                <a
                  href={photo.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-200 hover:text-white flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Original Asset
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

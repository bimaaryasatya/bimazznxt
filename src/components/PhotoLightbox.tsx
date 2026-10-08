"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  ShieldCheck,
  Tag,
  Share2,
  Check,
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
  const { t, language } = useApp();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (photo) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [photo]);

  const handleShare = async () => {
    if (!photo) return;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: `Railway Photograph by Bima Arya Satya: ${photo.title} (${photo.locomotive})`,
          url: shareUrl,
        });
        return;
      } catch {
        // User aborted share or share failed
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    const minSwipeDistance = 45; // 45px threshold

    if (diff < -minSwipeDistance && onNext) {
      onNext();
    } else if (diff > minSwipeDistance && onPrev) {
      onPrev();
    }
    setTouchStartX(null);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {photo && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-start sm:justify-center items-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-0 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={springPhysics}
            className="photo-lightbox relative my-auto z-10 w-full max-w-5xl lg:max-w-6xl h-auto max-h-[88vh] sm:max-h-[92vh] bg-zinc-950/95 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl"
          >
            {/* Close Button Top Right - Fixed & Prominent */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-40 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/75 hover:bg-black/90 active:scale-90 text-zinc-200 hover:text-white border border-white/20 backdrop-blur-md transition-all shadow-xl cursor-pointer touch-manipulation"
              title="Tutup (Esc)"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left/Top Viewport: High Resolution Photograph */}
            <div
              className="relative w-full shrink-0 h-[220px] xs:h-[260px] sm:h-[350px] lg:h-auto lg:flex-1 lg:min-h-[580px] bg-black flex items-center justify-center p-2 sm:p-4 group select-none overflow-hidden touch-pan-y"
              onContextMenu={(e) => e.preventDefault()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="relative w-full h-full select-none flex items-center justify-center"
                onContextMenu={(e) => e.preventDefault()}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  priority
                  draggable={false}
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-contain pointer-events-none select-none"
                />

                {/* Security shield overlay with pointer-events-none so it doesn't block clicks/touches */}
                <div
                  className="absolute inset-0 z-10 select-none pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Prev / Next Floating Navigation */}
              {onPrev && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/65 hover:bg-black/90 active:scale-90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-xl cursor-pointer touch-manipulation"
                  title="Foto sebelumnya (←)"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/65 hover:bg-black/90 active:scale-90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-xl cursor-pointer touch-manipulation"
                  title="Foto selanjutnya (→)"
                  aria-label="Next photo"
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
              className="w-full lg:w-[400px] xl:w-[430px] flex-1 lg:flex-initial p-4 sm:p-6 lg:p-7 bg-[#09090c]/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/[0.08] overflow-y-auto min-h-0 flex flex-col justify-between"
            >
              <div className="space-y-4 sm:space-y-5">
                {/* Header: Locomotive & Weather Badges */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 shadow-sm">
                    <Train className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                    {photo.locomotive}
                  </span>
                  {photo.timeWeather && (
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 flex items-center gap-1">
                      <CloudSun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                      {photo.timeWeather}
                    </span>
                  )}
                  {photo.region && (
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                      {photo.region}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight leading-snug mb-1">
                    {photo.title}
                  </h2>
                  {photo.trainName && (
                    <div className="text-[11px] sm:text-xs font-mono text-cyan-400 mb-2 sm:mb-3 flex items-center gap-1">
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
                <div className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.07] space-y-2">
                  <h4 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                    Field Trackage Location
                  </h4>
                  <div className="text-xs sm:text-sm font-medium text-zinc-200">
                    {photo.location}
                  </div>
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-zinc-400 pt-1 border-t border-white/[0.05]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {formatDate(photo.dateTaken)}
                    </span>
                    <span>{formatDateTime(photo.dateTaken).split(",")[1] || ""}</span>
                  </div>
                </div>

                {/* Camera & Optics EXIF Spec Card */}
                <div className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.07] space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-semibold">
                      <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                      Technical EXIF Specs
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Direct Sensor
                    </span>
                  </div>

                  {/* Body & Lens */}
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-zinc-200">
                      {photo.cameraModel || "Sony ILCE-7M4"}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      {photo.lens || "FE 70-200mm F2.8 GM OSS II"}
                    </div>
                  </div>

                  {/* Four-Column EXIF Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.05]">
                    <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mb-0.5">
                        <Gauge className="w-3 h-3 text-cyan-400" />
                        {t.lightbox.focalLength}
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-100">
                        {photo.focalLength || "70mm"}
                      </div>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mb-0.5">
                        <Aperture className="w-3 h-3 text-cyan-400" />
                        {t.lightbox.aperture}
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-100">
                        {photo.aperture || "f/2.8"}
                      </div>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mb-0.5">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {t.lightbox.shutterSpeed}
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-100">
                        {photo.shutterSpeed || "1/1000s"}
                      </div>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
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
                    <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Archive Tags
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {photo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono bg-white/[0.03] border border-white/[0.08] text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer: Close & Share */}
              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/[0.08] flex items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-98 border border-white/[0.1] text-xs font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Close" : "Tutup"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 sm:flex-initial py-2 sm:py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 active:scale-98 border border-cyan-500/30 text-xs font-medium text-cyan-300 hover:text-cyan-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="Share Portfolio Link"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === "en" ? "Copied!" : "Tersalin!"}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{language === "en" ? "Share" : "Bagikan"}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}


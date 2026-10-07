"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Photo } from "@/lib/types";
import { ArrowRight, Expand } from "lucide-react";
import { useApp } from "@/context/AppContext";

import { CollageContent } from "@/lib/siteContent";

interface FeaturedCollageProps {
  photos: Photo[];
  totalPhotosCount: number;
  onSelectPhoto: (photo: Photo) => void;
  onToggleFullArchive: () => void;
  showFullArchive: boolean;
  content?: CollageContent;
}

export function FeaturedCollage({
  photos,
  totalPhotosCount,
  onSelectPhoto,
  onToggleFullArchive,
  showFullArchive,
  content,
}: FeaturedCollageProps) {
  const { t } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Prioritize curated/showcase photos (isFeatured), then fill remaining slots up to 4
  const featuredList = photos.filter((p) => p.isFeatured);
  const nonFeatured = photos.filter((p) => !p.isFeatured);
  const collagePhotos = [...featuredList, ...nonFeatured].slice(0, 4);

  if (collagePhotos.length === 0) return null;

  // Calculate motion displacement ("menggeser 3 foto lainnya atau motion menghilang")
  const getMotionTransform = (idx: number) => {
    if (hoveredIdx === null) {
      return {
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      };
    }

    if (hoveredIdx === idx) {
      return {
        scale: 1.025,
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      };
    }

    // Other 3 photos react: smooth scale down, motion fade & directional nudge
    let x = 0;
    let y = 0;

    if (hoveredIdx === 0) {
      // Hovering left large card -> push right cards to the right
      x = 8;
    } else {
      // Hovering any right card -> push left card to the left
      if (idx === 0) x = -8;

      if (hoveredIdx === 1) {
        // Top right hovered -> push bottom cards down
        if (idx === 2 || idx === 3) y = 8;
      } else if (hoveredIdx === 2) {
        // Bottom left hovered -> push top card up, sibling card right
        if (idx === 1) y = -8;
        if (idx === 3) x = 8;
      } else if (hoveredIdx === 3) {
        // Bottom right hovered -> push top card up, sibling card left
        if (idx === 1) y = -8;
        if (idx === 2) x = -8;
      }
    }

    return {
      scale: 0.97,
      opacity: 0.38,
      x,
      y,
      filter: "blur(0.5px)",
    };
  };

  const renderCollageCard = (
    photo: Photo,
    idx: number,
    containerClass: string,
    isHero = false
  ) => {
    const isHovered = hoveredIdx === idx;
    const motionProps = getMotionTransform(idx);

    return (
      <motion.div
        key={photo.id}
        animate={motionProps}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 26,
          mass: 0.8,
        }}
        onHoverStart={() => setHoveredIdx(idx)}
        onHoverEnd={() => setHoveredIdx(null)}
        onClick={() => onSelectPhoto(photo)}
        style={{ zIndex: isHovered ? 30 : 10 }}
        className={`group relative rounded-2xl overflow-hidden cursor-pointer border bg-black shadow-2xl transition-colors duration-300 select-none ${
          isHovered
            ? "border-white/40 ring-1 ring-white/20 shadow-indigo-500/10"
            : "border-white/10 hover:border-white/25"
        } ${containerClass}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Full-Bleed Photograph Canvas */}
        <Image
          src={photo.thumbnailUrl || photo.imageUrl}
          alt={photo.title}
          fill
          priority={isHero}
          quality={80}
          draggable={false}
          sizes={
            isHero
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 60vw"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 30vw"
          }
          className="object-cover w-full h-full pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover Inspect Expand Center Trigger */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1.5px] z-20 transition-opacity duration-300 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/25 text-white text-xs font-medium flex items-center gap-1.5 shadow-2xl">
            <Expand className="w-3.5 h-3.5" />
            {t.collage.inspectSpecs}
          </div>
        </div>

        {/* Bottom Dark Gradient for High-Contrast Minimalist Text Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-15 pointer-events-none" />

        {/* Minimalist White Text Stacked Directly in Bottom-Left Corner */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-20 pointer-events-none text-left photo-text-overlay">
          {/* Location & Train Service */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 mb-1">
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

          {/* Master Title */}
          <h3
            className={`font-bold text-white tracking-tight leading-tight line-clamp-1 mb-2 ${
              isHero ? "text-lg sm:text-2xl" : "text-sm sm:text-base"
            }`}
          >
            {photo.title}
          </h3>

          {/* Clean Monospaced White EXIF Line */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/90 truncate">
            <span className="truncate">
              {photo.focalLength || "50mm"} • {photo.aperture || "f/2.8"} •{" "}
              {photo.shutterSpeed || "1/1000s"} • ISO {photo.iso || "100"}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

    return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="relative py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Vercel SaaS Header: Clean Bold Typography with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-jakarta">
            {content?.title || t.collage.title}
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 font-normal max-w-xl">
            {content?.subtitle || t.collage.subtitle}
          </p>
        </div>

        {/* Top Link Trigger to Full Archive */}
        <button
          onClick={onToggleFullArchive}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <span>
            {showFullArchive
              ? t.collage.collapseArchive
              : t.collage.viewFullArchive.replace(
                  "{count}",
                  String(totalPhotosCount)
                )}
          </span>
          <ArrowRight
            className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform ${
              showFullArchive ? "rotate-90" : "group-hover:translate-x-1"
            }`}
          />
        </button>
      </motion.div>

      {/* Asymmetric 4-Photo Bento Grid with Cascading Reveal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column (Hero Card): 7 Cols, Full Height */}
        {collagePhotos[0] && (
          <motion.div
            initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 h-[360px] sm:h-[480px] lg:h-[580px]"
          >
            {renderCollageCard(
              collagePhotos[0],
              0,
              "w-full h-full",
              true
            )}
          </motion.div>
        )}

        {/* Right Column (3 Cards): 5 Cols, Stacked Vertically */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 h-auto lg:h-[580px]">
          {/* Top Right Card: Wide 1 Card */}
          {collagePhotos[1] && (
            <motion.div
              initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="h-[220px] sm:h-[260px] lg:h-[275px]"
            >
              {renderCollageCard(collagePhotos[1], 1, "w-full h-full")}
            </motion.div>
          )}

          {/* Bottom Right Cards: 2 Side-by-Side Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 flex-1 min-h-[190px] sm:min-h-[220px] lg:min-h-[285px]">
            {collagePhotos[2] && (
              <motion.div
                initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="h-full"
              >
                {renderCollageCard(collagePhotos[2], 2, "w-full h-full")}
              </motion.div>
            )}
            {collagePhotos[3] && (
              <motion.div
                initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="h-full"
              >
                {renderCollageCard(collagePhotos[3], 3, "w-full h-full")}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Prominent Vercel-Style Interactive CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-10 sm:mt-12 flex justify-center"
      >
        <button
          onClick={onToggleFullArchive}
          className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 rounded-full bg-zinc-900 text-white hover:bg-black dark:bg-white/[0.05] dark:hover:bg-white/[0.12] dark:text-white border border-zinc-200 dark:border-white/10 dark:hover:border-white/30 font-medium text-xs sm:text-sm transition-all shadow-md dark:shadow-2xl backdrop-blur-md hover:scale-[1.02]"
        >
          <span>
            {showFullArchive
              ? t.collage.collapseArchive
              : t.collage.viewFullArchive.replace(
                  "{count}",
                  String(totalPhotosCount)
                )}
          </span>
          <ArrowRight
            className={`w-4 h-4 text-zinc-400 group-hover:text-white transition-transform ${
              showFullArchive ? "rotate-90" : "group-hover:translate-x-1"
            }`}
          />
        </button>
      </motion.div>
    </motion.section>
  );
}

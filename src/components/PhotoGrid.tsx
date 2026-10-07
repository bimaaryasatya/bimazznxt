"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Photo } from "@/lib/types";
import { PhotoCard } from "./PhotoCard";
import { Train, Camera, AlertCircle } from "lucide-react";

interface PhotoGridProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
  isLoading?: boolean;
}

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export function PhotoGrid({
  photos,
  onSelectPhoto,
  isLoading = false,
}: PhotoGridProps) {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl glass-panel aspect-[4/3] shimmer-mask border border-white/[0.05]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-500 dark:text-cyan-400">
          <Train className="w-8 h-8 opacity-80" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200 mb-2">
          No Railway Photographs Found
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          No archives match your active filter criteria or locomotive search. Try
          broadening your query or selecting another Daop region.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onSelect={onSelectPhoto}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

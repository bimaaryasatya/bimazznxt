"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { useApp } from "@/context/AppContext";

interface AboutGearSectionProps {
  content?: AboutContent;
}

export function AboutGearSection({
  content = DEFAULT_SITE_CONTENT.about,
}: AboutGearSectionProps) {
  const { t } = useApp();
  const [bioImgLoaded, setBioImgLoaded] = useState(false);
  const [gearImgLoaded, setGearImgLoaded] = useState(false);

  const bioImage =
    content.bioImageUrl ||
    "https://images.unsplash.com/photo-1515165562839-978bbcf18277?q=80&w=1200&auto=format&fit=crop";

  const gearImage =
    content.gearImageUrl ||
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop";

  return (
    <>
      {/* SECTION 1: Photographer Bio & Documentary Journey */}
      <motion.section
        id="about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="py-16 sm:py-24 relative border-t border-zinc-200 dark:border-white/[0.08]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Bio & Journey Narrative */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-6 space-y-5"
            >
              <h2 className="text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight leading-snug font-jakarta">
                {content.title}
              </h2>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                {content.bio}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs sm:text-sm font-mono text-zinc-500 dark:text-zinc-400 flex-wrap">
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  {content.photographerName}
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span>{content.photographerRole}</span>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                  {content.regionCoverage}
                </span>
              </div>
            </motion.div>

            {/* Right: Static Sample Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-6"
            >
              <div 
                className="group relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 shadow-md dark:shadow-2xl select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                {!bioImgLoaded && (
                  <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900/80 shimmer-mask z-0" />
                )}

                <Image
                  src={bioImage}
                  alt={content.title}
                  fill
                  quality={80}
                  draggable={false}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onLoad={() => setBioImgLoaded(true)}
                  className={`object-cover w-full h-full pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105 ${
                    bioImgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Subtle Edge Glow & Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Corner Label */}
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-black/60 backdrop-blur-md border border-white/15 text-zinc-200">
                    Trackside Documentary Archive
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 2: Technical Arsenal */}
      <motion.section
        id="gear"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="py-16 sm:py-24 relative border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50/60 dark:bg-zinc-950/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Gear / Setup Photograph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-5 order-2 lg:order-1"
            >
              <div 
                className="group relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 shadow-md dark:shadow-2xl select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                {!gearImgLoaded && (
                  <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900/80 shimmer-mask z-0" />
                )}

                <Image
                  src={gearImage}
                  alt="Technical Optical Arsenal"
                  fill
                  quality={80}
                  draggable={false}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  onLoad={() => setGearImgLoaded(true)}
                  className={`object-cover w-full h-full pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105 ${
                    gearImgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Subtle Edge Glow & Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Corner Label */}
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-black/60 backdrop-blur-md border border-white/15 text-zinc-200">
                    Optical Rig & Field Arsenal
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right: Technical Arsenal Text & Inventory */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-7 order-1 lg:order-2 space-y-6"
            >
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight leading-snug font-jakarta">
                  {content.gearTitle || "Technical Arsenal"}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-normal leading-relaxed">
                  {content.gearSubtitle ||
                    "High-speed shutter bodies, telephoto glass, and rugged trackside stabilizers built for high-tempo mainline documentary work."}
                </p>
              </div>

              {/* 3 Categories Grid with Staggered Fade Up */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 pt-2">
                {/* 1. Camera Bodies */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="space-y-3 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] shadow-sm dark:shadow-none hover:border-cyan-500/30 transition-colors"
                >
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold">
                    {t.about.primaryBodies}
                  </h4>
                  <ul className="space-y-2 text-xs font-mono">
                    {content.gearBodies.map((gear, idx) => (
                      <li key={idx}>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium block">
                          {gear.name}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          {gear.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* 2. Master Optics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="space-y-3 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] shadow-sm dark:shadow-none hover:border-cyan-500/30 transition-colors"
                >
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold">
                    {t.about.masterOptics}
                  </h4>
                  <ul className="space-y-2 text-xs font-mono">
                    {content.gearOptics.map((gear, idx) => (
                      <li key={idx}>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium block">
                          {gear.name}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          {gear.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* 3. Field Gear */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="space-y-3 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] shadow-sm dark:shadow-none hover:border-cyan-500/30 transition-colors"
                >
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold">
                    {t.about.fieldEssentials}
                  </h4>
                  <ul className="space-y-2 text-xs font-mono">
                    {content.gearField.map((gear, idx) => (
                      <li key={idx}>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium block">
                          {gear.name}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          {gear.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
}

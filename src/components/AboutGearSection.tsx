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
  const [gearImgLoaded, setGearImgLoaded] = useState(false);

  const gearImage =
    content.gearImageUrl ||
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop";

  return (
    <motion.section
      id="gear"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="py-16 sm:py-24 relative border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50/60 dark:bg-zinc-950/30 [content-visibility:auto] [contain-intrinsic-size:1px_650px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Gear / Setup Photograph */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div
              className="group relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 shadow-md dark:shadow-xl select-none [transform:translateZ(0)]"
              onContextMenu={(e) => e.preventDefault()}
            >
              {!gearImgLoaded && (
                <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900/80 shimmer-mask z-0" />
              )}

              <Image
                src={gearImage}
                alt="Technical Optical Arsenal"
                fill
                quality={75}
                draggable={false}
                decoding="async"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 45vw"
                onLoad={() => setGearImgLoaded(true)}
                className={`object-cover w-full h-full pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-105 ${
                  gearImgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>

          {/* Right: Technical Arsenal Text & Inventory */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight leading-snug font-jakarta">
                {content.gearTitle || "Technical Arsenal"}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-normal leading-relaxed">
                {content.gearSubtitle ||
                  "High-speed shutter bodies, telephoto glass, and rugged trackside stabilizers built for high-tempo mainline documentary work."}
              </p>
            </div>

            {/* 3 Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-2">
              {/* 1. Camera Bodies */}
              <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] shadow-sm hover:border-cyan-500/30 transition-colors">
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
              </div>

              {/* 2. Master Optics */}
              <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] shadow-sm hover:border-cyan-500/30 transition-colors">
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
              </div>

              {/* 3. Field Gear */}
              <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] shadow-sm hover:border-cyan-500/30 transition-colors">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { useApp } from "@/context/AppContext";
import {
  User,
  MapPin,
  Clock,
  Train,
  Quote,
  Instagram,
  Youtube,
  Mail,
  Camera,
  Sparkles,
} from "lucide-react";

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
      {/* SECTION 1: Profil Pengkarya & Rekam Jejak Visual */}
      <motion.section
        id="about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="py-16 sm:py-24 relative border-t border-zinc-200 dark:border-white/[0.08]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
          {/* Section Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-sm">
              <User className="w-3.5 h-3.5" />
              <span>{t.about?.badge || "Profil Pengkarya"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight font-jakarta">
              {content.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Creator Identity, Story & Socials */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Creator Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-2xl relative overflow-hidden space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                  {/* Avatar / Portrait */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-zinc-900 shadow-md relative group">
                      {content.avatarUrl ? (
                        <Image
                          src={content.avatarUrl}
                          alt={content.photographerName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 text-cyan-400 font-mono font-bold">
                          <Camera className="w-8 h-8 text-cyan-400 mb-0.5" />
                          <span className="text-[10px] tracking-wider text-zinc-400">ARCHIVE</span>
                        </div>
                      )}
                    </div>
                    {/* Active Trackside Status Dot */}
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-zinc-950"></span>
                    </span>
                  </div>

                  {/* Creator Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-jakarta tracking-tight">
                        {content.photographerName}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                        {t.about?.activeBadge || "Aktif di Tepi Rel"}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-mono text-cyan-600 dark:text-cyan-400 font-medium">
                      {content.photographerRole}
                    </p>

                    <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400 flex-wrap pt-1">
                      {content.locationBase && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span>{content.locationBase}</span>
                        </span>
                      )}
                      {content.experienceYears && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span>{content.experienceYears}</span>
                        </span>
                      )}
                      {content.regionCoverage && (
                        <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-medium">
                          <Train className="w-3.5 h-3.5 shrink-0" />
                          <span>{content.regionCoverage}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media & Contact Links */}
                {(content.socialInstagram || content.socialYoutube || content.socialEmail || content.socialX) && (
                  <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mr-1 hidden sm:inline">
                      {t.about?.connectWith || "Kontak:"}
                    </span>
                    {content.socialInstagram && (
                      <a
                        href={content.socialInstagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/80 dark:border-white/10 transition-all cursor-pointer"
                        title="Instagram Pengkarya"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-500" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {content.socialYoutube && (
                      <a
                        href={content.socialYoutube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/80 dark:border-white/10 transition-all cursor-pointer"
                        title="YouTube Channel"
                      >
                        <Youtube className="w-3.5 h-3.5 text-red-500" />
                        <span>YouTube</span>
                      </a>
                    )}
                    {content.socialEmail && (
                      <a
                        href={`mailto:${content.socialEmail}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/80 dark:border-white/10 transition-all cursor-pointer"
                        title="Email Pengkarya"
                      >
                        <Mail className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Bio Story Narrative */}
              <div className="space-y-3">
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
                  {content.bio}
                </p>
              </div>

              {/* Artist Statement Quote */}
              {content.statement && (
                <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/[0.04] dark:bg-cyan-500/[0.03] border border-cyan-500/20 relative shadow-sm">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-cyan-500/50 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-serif italic text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        &ldquo;{content.statement}&rdquo;
                      </p>
                      <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold text-right">
                        — {content.photographerName}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats Grid */}
              {content.stats && content.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {content.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] text-center shadow-sm dark:shadow-none"
                    >
                      <div className="text-sm sm:text-base font-bold font-mono text-zinc-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right Column: Trackside Action Photograph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-5"
            >
              <div 
                className="group relative w-full h-[340px] sm:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 shadow-md dark:shadow-2xl select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                {!bioImgLoaded && (
                  <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900/80 shimmer-mask z-0" />
                )}

                <Image
                  src={bioImage}
                  alt={content.title}
                  fill
                  quality={85}
                  draggable={false}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  onLoad={() => setBioImgLoaded(true)}
                  className={`object-cover w-full h-full pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105 ${
                    bioImgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Subtle Edge Glow & Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Corner Label */}
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-black/60 backdrop-blur-md border border-white/15 text-zinc-200 flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Trackside Documentary Archive</span>
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

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { Instagram, Youtube, Mail, ExternalLink } from "lucide-react";

interface CreatorProfileSectionProps {
  content?: AboutContent;
}

export function CreatorProfileSection({
  content = DEFAULT_SITE_CONTENT.about,
}: CreatorProfileSectionProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const displayImage =
    content.bioImageUrl ||
    content.avatarUrl ||
    "https://images.unsplash.com/photo-1515165562839-978bbcf18277?q=80&w=1200&auto=format&fit=crop";

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="py-16 sm:py-24 relative border-t border-zinc-200 dark:border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Kolom Teks: Judul, Deskripsi, Button Media Sosial di bawahnya */}
          <div className="lg:col-span-7 space-y-6">
            {/* Judul */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight font-jakarta">
              {content.title}
            </h2>

            {/* Deskripsi */}
            <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
              {content.bio}
            </p>

            {/* Button Media Sosial (di bawah deskripsi) */}
            {(content.socialInstagram ||
              content.socialYoutube ||
              content.socialEmail ||
              content.socialX) && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {content.socialInstagram && (
                  <a
                    href={content.socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white border border-zinc-200/80 dark:border-white/10 transition-all shadow-sm active:scale-95"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span>Instagram</span>
                  </a>
                )}

                {content.socialYoutube && (
                  <a
                    href={content.socialYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white border border-zinc-200/80 dark:border-white/10 transition-all shadow-sm active:scale-95"
                    title="YouTube Channel"
                  >
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span>YouTube</span>
                  </a>
                )}

                {content.socialEmail && (
                  <a
                    href={`mailto:${content.socialEmail}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white border border-zinc-200/80 dark:border-white/10 transition-all shadow-sm active:scale-95"
                    title="Email"
                  >
                    <Mail className="w-4 h-4 text-cyan-500" />
                    <span>Email</span>
                  </a>
                )}

                {content.socialX && (
                  <a
                    href={content.socialX}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white border border-zinc-200/80 dark:border-white/10 transition-all shadow-sm active:scale-95"
                    title="X / Twitter"
                  >
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                    <span>X (Twitter)</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Kolom Gambar: Sampingnya Gambar */}
          <div className="lg:col-span-5">
            <div
              className="group relative w-full h-[320px] sm:h-[420px] lg:h-[460px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 shadow-md dark:shadow-2xl select-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              {!imgLoaded && (
                <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900/80 shimmer-mask z-0" />
              )}

              <Image
                src={displayImage}
                alt={content.title || "Profil Pengkarya"}
                fill
                quality={90}
                draggable={false}
                sizes="(max-width: 1024px) 100vw, 45vw"
                onLoad={() => setImgLoaded(true)}
                className={`object-cover w-full h-full pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

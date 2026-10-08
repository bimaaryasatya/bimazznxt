"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HeroContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1], // Cinematic fluid deceleration curve
    },
  },
};

interface HeroSectionProps {
  content?: HeroContent;
  onExploreArchive?: () => void;
}

export function HeroSection({
  content = DEFAULT_SITE_CONTENT.hero,
  onExploreArchive,
}: HeroSectionProps) {
  return (
    <section className="relative pt-6 pb-12 md:pt-12 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-4xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline with Optical Focus Easing */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.08] mb-6 font-jakarta"
          >
            {content.headline}{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-cyan-500 dark:from-cyan-400 dark:via-sky-200 dark:to-cyan-200 bg-clip-text text-transparent">
              {content.headlineHighlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8 font-normal"
          >
            {content.subtitle}
          </motion.p>

          {/* Quick Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-3.5"
          >
            <a
              href="#archive"
              onClick={(e) => {
                if (onExploreArchive) {
                  onExploreArchive();
                }
              }}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium text-xs sm:text-sm transition-all shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{content.ctaPrimaryText}</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#gear"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 hover:text-black border border-zinc-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white dark:border-white/10 font-medium text-xs sm:text-sm transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              {content.ctaSecondaryText}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

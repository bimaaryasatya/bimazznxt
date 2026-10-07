"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const springPhysics = {
  type: "spring" as const,
  damping: 25,
  stiffness: 200,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springPhysics,
  },
};

import { HeroContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";

interface HeroSectionProps {
  content?: HeroContent;
  onExploreArchive?: () => void;
}

export function HeroSection({
  content = DEFAULT_SITE_CONTENT.hero,
  onExploreArchive,
}: HeroSectionProps) {
  return (
    <section className="relative pt-8 pb-12 md:pt-14 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.08] mb-6"
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
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-3">
            <a
              href="#archive"
              onClick={(e) => {
                if (onExploreArchive) {
                  onExploreArchive();
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02]"
            >
              {content.ctaPrimaryText}
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
            <a
              href="#gear"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white dark:border-white/10 font-medium text-xs sm:text-sm transition-all"
            >
              {content.ctaSecondaryText}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

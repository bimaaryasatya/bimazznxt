"use client";

import React from "react";
import { motion } from "framer-motion";

export function AmbientAurora() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 [contain:strict] [transform:translateZ(0)]"
      aria-hidden="true"
    >
      {/* Crisp & High-Contrast Grid Canvas (Softened slightly for sleek balance) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-55 [transform:translateZ(0)]" />

      {/* Gentle Edge Vignette (Keeps grid crisp and prominent across the center) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,#030303_100%)] dark:block hidden pointer-events-none [transform:translateZ(0)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,#f8fafc_100%)] dark:hidden block pointer-events-none [transform:translateZ(0)]" />

      {/* Hero Ambient Radial Spotlight Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none animate-pulse-subtle [transform:translateZ(0)]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.14) 45%, transparent 72%)",
        }}
      />

      {/* Floating Animated Aurora Mesh 1 (Left Orb with Smooth Hardware-Accelerated Drift) */}
      <div
        className="absolute -top-[12%] left-[10%] w-[680px] h-[680px] rounded-full pointer-events-none animate-aurora-slow will-change-transform [transform:translateZ(0)]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(99, 102, 241, 0.32) 0%, rgba(139, 92, 246, 0.2) 35%, rgba(6, 182, 212, 0.08) 55%, transparent 72%)",
        }}
      />

      {/* Floating Animated Aurora Mesh 2 (Right Orb with Counter Drift) */}
      <div
        className="absolute top-[16%] -right-[8%] w-[720px] h-[720px] rounded-full pointer-events-none animate-aurora-reverse will-change-transform [transform:translateZ(0)]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(6, 182, 212, 0.28) 0%, rgba(59, 130, 246, 0.18) 40%, rgba(99, 102, 241, 0.08) 60%, transparent 72%)",
        }}
      />

      {/* Subtle outer vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_70%,rgba(0,0,0,0.45)_100%)] pointer-events-none dark:block hidden [transform:translateZ(0)]" />
    </motion.div>
  );
}

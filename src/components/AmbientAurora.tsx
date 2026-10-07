"use client";

import React from "react";

export function AmbientAurora() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 [contain:strict] [transform:translateZ(0)]"
      aria-hidden="true"
    >
      {/* Linear SaaS Grid Canvas */}
      <div className="absolute inset-0 bg-grid-pattern opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_90%)] [transform:translateZ(0)]" />

      {/* Hero Ambient Radial Spotlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/15 via-cyan-500/10 to-transparent blur-[70px] rounded-full pointer-events-none [transform:translateZ(0)]" />

      {/* Floating Animated Aurora Mesh (GPU-accelerated with will-change and reduced blur) */}
      <div className="absolute -top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/30 via-violet-500/20 to-cyan-400/15 blur-[75px] animate-aurora-slow dark:opacity-90 opacity-40 will-change-transform [transform:translateZ(0)]" />
      <div className="absolute top-[20%] -right-[5%] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-cyan-500/25 via-blue-600/15 to-indigo-700/20 blur-[80px] animate-aurora-reverse dark:opacity-90 opacity-40 will-change-transform [transform:translateZ(0)]" />

      {/* Subtle vignette border at extreme edges (Dark mode only) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none dark:block hidden [transform:translateZ(0)]" />
    </div>
  );
}

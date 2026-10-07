"use client";

import React from "react";

export function AmbientAurora() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Vercel / Linear SaaS Linear Grid Canvas */}
      <div className="absolute inset-0 bg-grid-pattern opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_90%)]" />

      {/* Hero Ambient Radial Spotlight Glow (Vercel Style) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-indigo-500/20 via-cyan-500/15 to-transparent blur-[100px] rounded-full pointer-events-none" />

      {/* Floating Animated Aurora Mesh */}
      <div className="absolute -top-[10%] left-[15%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-indigo-600/35 via-violet-500/25 to-cyan-400/20 blur-[120px] animate-aurora-slow dark:opacity-100 opacity-40" />
      <div className="absolute top-[20%] -right-[5%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-cyan-500/30 via-blue-600/20 to-indigo-700/25 blur-[130px] animate-aurora-reverse dark:opacity-100 opacity-40" />
      <div className="absolute bottom-[5%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-600/25 via-indigo-600/20 to-transparent blur-[130px] animate-aurora-slow dark:opacity-100 opacity-30" />

      {/* Subtle vignette border at extreme edges (Dark mode only) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none dark:block hidden" />
    </div>
  );
}

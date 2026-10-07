"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  Train,
  Camera,
  ChevronRight,
  Lock,
} from "lucide-react";
import { BrandContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { useApp } from "@/context/AppContext";

interface NavbarProps {
  initialBrand?: BrandContent;
}

export function Navbar({ initialBrand }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brand, setBrand] = useState<BrandContent>(
    initialBrand || DEFAULT_SITE_CONTENT.brand
  );
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Only fetch if initialBrand was not provided or on curator update
    const fetchBrand = async () => {
      try {
        const res = await fetch("/api/site-content");
        if (res.ok) {
          const data = await res.json();
          if (data.content?.brand) {
            setBrand(data.content.brand);
          }
        }
      } catch (err) {
        // Fallback to default
      }
    };

    if (!initialBrand) {
      fetchBrand();
    }

    // Listen to custom event dispatched when Curator saves changes
    const handleContentUpdated = () => {
      fetchBrand();
    };
    window.addEventListener("site-content-updated", handleContentUpdated);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("site-content-updated", handleContentUpdated);
    };
  }, [initialBrand]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? "bg-white/90 dark:bg-black/85 backdrop-blur-md border-b border-zinc-200 dark:border-white/[0.08] py-2.5 sm:py-3 shadow-sm dark:shadow-2xl"
          : "bg-white/60 dark:bg-black/40 backdrop-blur-sm border-b border-zinc-200/60 dark:border-white/[0.05] py-3 sm:py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 sm:gap-2.5 group py-1 shrink-0"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-contain hidden dark:block"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-dark.png"
                alt="Logo"
                className="w-full h-full object-contain block dark:hidden"
              />
            </div>
            <span className="font-jakarta font-bold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
              <span>{brand.name || "BIMAZZNXT"}</span>
              {brand.tag && (
                <span className="hidden sm:inline text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                  {brand.tag}
                </span>
              )}
            </span>
          </Link>

          {/* Desktop Navigation Links + Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Links (Hidden on small screens) */}
            <nav className="hidden sm:flex items-center gap-4 lg:gap-5">
              <Link
                href="/#archive"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-archive"));
                  }
                }}
                className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {t.nav.archive}
              </Link>
              <Link
                href="/#gear"
                className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {t.nav.optics}
              </Link>
            </nav>

            <div className="h-4 w-px bg-zinc-200 dark:bg-white/10 hidden sm:block" />

            {/* Language Switcher Button (EN / ID) */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="px-2 py-1 rounded-lg text-[11px] font-mono font-medium border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-all flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100/80 dark:bg-white/[0.04]"
              title={language === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
            >
              <Globe className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
              <span className="font-bold">{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-all text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100/80 dark:bg-white/[0.04]"
              title={theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-cyan-600" />
              )}
            </button>

            {/* Mobile Hamburger Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="sm:hidden p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100/80 dark:bg-white/[0.04] transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-cyan-500" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl px-3 py-3 space-y-1 mt-2.5 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="/#archive"
              onClick={() => {
                setMobileMenuOpen(false);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-archive"));
                }
              }}
              className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Train className="w-4 h-4 text-cyan-500" />
                <span>{t.nav.archive}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>

            <Link
              href="/#gear"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-cyan-500" />
                <span>{t.nav.optics}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>

            <div className="pt-1.5 border-t border-zinc-100 dark:border-white/[0.06]">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Curator Studio</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

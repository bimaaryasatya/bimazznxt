"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { FooterContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";

interface FooterProps {
  initialContent?: FooterContent;
}

export function Footer({ initialContent }: FooterProps) {
  const [content, setContent] = useState<FooterContent>(
    initialContent || DEFAULT_SITE_CONTENT.footer
  );

  useEffect(() => {
    // Fetch site content to load dynamic footer
    const fetchFooter = async () => {
      try {
        const res = await fetch("/api/site-content");
        if (res.ok) {
          const data = await res.json();
          if (data.content?.footer) {
            setContent(data.content.footer);
          }
        }
      } catch (err) {
        // Fallback to default
      }
    };
    fetchFooter();

    // Listen to custom event dispatched when Curator updates site content
    const handleContentUpdated = () => {
      fetchFooter();
    };
    window.addEventListener("site-content-updated", handleContentUpdated);

    return () => {
      window.removeEventListener("site-content-updated", handleContentUpdated);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-zinc-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#030303]/90 backdrop-blur-md pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-12">
          {/* Brand Info (Text only, no icon, badges removed) */}
          <div className="md:col-span-7 lg:col-span-8 space-y-3">
            <h3 className="font-jakarta font-bold text-zinc-900 dark:text-white tracking-wider text-base sm:text-lg uppercase">
              {content.brandTitle || "BIMA RAILWAY ARCHIVE"}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Locomotive Classes / Motive Power */}
          <div className="md:col-span-5 lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-4 font-mono">
              {content.motivePowerTitle || "Documented Motive Power"}
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 font-sans">
              {(content.motivePowerList || []).map((item, idx) => (
                <li
                  key={idx}
                  className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar (Curator login removed, editable copyright) */}
        <div className="pt-8 border-t border-zinc-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p className="text-center sm:text-left">{content.copyright}</p>
          <div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Back to Top
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

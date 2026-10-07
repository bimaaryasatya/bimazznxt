"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  SlidersHorizontal,
  Train,
  CloudSun,
  MapPin,
  Calendar,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { FilterState } from "@/lib/types";
import { CategoryContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { useApp } from "@/context/AppContext";

interface FilterPromptBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
  categories?: CategoryContent;
}

const YEAR_OPTIONS = ["all", "2024", "2023", "2022", "2021", "2020", "2019"];

export function FilterPromptBar({
  filters,
  onFilterChange,
  resultCount,
  categories = DEFAULT_SITE_CONTENT.categories,
}: FilterPromptBarProps) {
  const { t } = useApp();
  const locomotiveOptions = categories.locomotives || DEFAULT_SITE_CONTENT.categories.locomotives;
  const regionOptions = categories.regions || DEFAULT_SITE_CONTENT.categories.regions;
  const weatherOptions = categories.weather || DEFAULT_SITE_CONTENT.categories.weather;
  const [isFocused, setIsFocused] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.locomotive !== "all" ||
    filters.weather !== "all" ||
    filters.region !== "all" ||
    filters.year !== "all";

  const handleReset = () => {
    onFilterChange({
      searchQuery: "",
      locomotive: "all",
      region: "all",
      year: "all",
      weather: "all",
    });
  };

  return (
    <div id="archive" className="w-full max-w-4xl mx-auto px-4 mb-10">
      {/* Prompt-Style Search Bar */}
      <motion.div
        className={`relative rounded-2xl transition-all duration-200 border ${
          isFocused
            ? "border-cyan-500/60 dark:border-white/40 bg-white dark:bg-zinc-950 shadow-lg shadow-cyan-500/5 dark:shadow-white/5"
            : "border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950/80 hover:border-zinc-300 dark:hover:border-white/20 shadow-sm dark:shadow-xl"
        }`}
        animate={{ scale: isFocused ? 1.005 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center px-4 py-3 sm:py-3.5 gap-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-white/[0.04] flex items-center justify-center shrink-0 text-zinc-500 dark:text-zinc-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t.filter.searchPlaceholder}
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
          />

          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1 hidden sm:block" />

          {/* Toggle advanced filter button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showAdvanced || hasActiveFilters
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.05]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.filter.filters}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
            )}
          </button>
        </div>

        {/* Ambient border glow when focused */}
        {isFocused && (
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-500/50 dark:via-white/50 to-transparent" />
        )}
      </motion.div>

      {/* Primary Locomotive Pill Slider */}
      <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none w-full sm:w-auto">
          {locomotiveOptions.map((loco) => {
            const isActive = filters.locomotive === loco.id;
            return (
              <button
                key={loco.id}
                onClick={() =>
                  onFilterChange({ ...filters, locomotive: loco.id })
                }
                className="relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 focus:outline-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeLocomotivePill"
                    className="absolute inset-0 rounded-full bg-zinc-900 dark:bg-white shadow-sm"
                    transition={{ type: "spring", stiffness: 240, damping: 25 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? "text-white dark:text-black font-semibold" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {loco.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Result Counter & Reset */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 ml-auto pt-1 sm:pt-0 font-mono">
          <span>
            <span className="text-zinc-900 dark:text-zinc-200 font-bold">{resultCount}</span>{" "}
            {t.filter.resultsCount}
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {t.filter.reset}
            </button>
          )}
        </div>
      </div>

      {/* Advanced Tag Pill Drawers (Collapsible) */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 25 }}
            className="overflow-hidden mt-4"
          >
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-950/80 shadow-sm dark:shadow-none space-y-3.5">
              {/* Atmospheric Weather Filter */}
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <span className="font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 shrink-0 w-28">
                  <CloudSun className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  {t.filter.weather}:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {weatherOptions.map((w) => {
                    const active = filters.weather === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() =>
                          onFilterChange({ ...filters, weather: w.id })
                        }
                        className={`px-3 py-1 rounded-full border transition-all ${
                          active
                            ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 font-semibold"
                            : "bg-zinc-100 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-white/20"
                        }`}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daop Region Filter */}
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <span className="font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 shrink-0 w-28">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  {t.filter.regions}:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {regionOptions.map((r) => {
                    const active = filters.region === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() =>
                          onFilterChange({ ...filters, region: r.id })
                        }
                        className={`px-3 py-1 rounded-full border transition-all ${
                          active
                            ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 font-semibold"
                            : "bg-zinc-100 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-white/20"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Archive Year Filter */}
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <span className="font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 shrink-0 w-28">
                  <Calendar className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  Chronology:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {YEAR_OPTIONS.map((y) => {
                    const active = filters.year === y;
                    return (
                      <button
                        key={y}
                        onClick={() =>
                          onFilterChange({ ...filters, year: y })
                        }
                        className={`px-3 py-1 rounded-full border transition-all ${
                          active
                            ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 font-semibold"
                            : "bg-zinc-100 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-white/20"
                        }`}
                      >
                        {y === "all" ? "All Years (2019-2025)" : y}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

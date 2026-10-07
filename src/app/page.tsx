"use client";

import React, { useState, useEffect, useMemo } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCollage } from "@/components/FeaturedCollage";
import { FilterPromptBar } from "@/components/FilterPromptBar";
import { PhotoGrid } from "@/components/PhotoGrid";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { AboutGearSection } from "@/components/AboutGearSection";
import { Photo, FilterState } from "@/lib/types";
import { INITIAL_PHOTOS } from "@/lib/data";
import { SiteContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { AnimatePresence, motion } from "framer-motion";

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showFullArchive, setShowFullArchive] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    locomotive: "all",
    region: "all",
    year: "all",
    weather: "all",
  });

  // Fetch photos & site content from API
  useEffect(() => {
    async function loadData() {
      try {
        const [photoRes, contentRes] = await Promise.all([
          fetch("/api/photos"),
          fetch("/api/site-content"),
        ]);
        if (photoRes.ok) {
          const data = await photoRes.json();
          if (Array.isArray(data.photos)) {
            setPhotos(data.photos);
          }
        }
        if (contentRes.ok) {
          const cData = await contentRes.json();
          if (cData.content) {
            setSiteContent(cData.content);
            if (cData.content.brand?.tabTitle) {
              document.title = cData.content.brand.tabTitle;
            }
          }
        }
      } catch (e) {
        console.warn("Could not fetch data from API, using initial dataset:", e);
      }
    }
    loadData();

    // Check if URL hash is #archive to auto-open archive
    if (typeof window !== "undefined") {
      if (window.location.hash === "#archive") {
        setShowFullArchive(true);
      }
      const handleHashChange = () => {
        if (window.location.hash === "#archive") {
          setShowFullArchive(true);
          setTimeout(() => {
            document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      };

      const handleOpenArchiveEvent = () => {
        setShowFullArchive(true);
        setTimeout(() => {
          document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      };

      const handleSiteContentUpdated = () => {
        loadData();
      };

      window.addEventListener("hashchange", handleHashChange);
      window.addEventListener("open-archive", handleOpenArchiveEvent);
      window.addEventListener("site-content-updated", handleSiteContentUpdated);
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
        window.removeEventListener("open-archive", handleOpenArchiveEvent);
        window.removeEventListener("site-content-updated", handleSiteContentUpdated);
      };
    }
  }, []);

  useEffect(() => {
    if (siteContent.brand?.tabTitle) {
      document.title = siteContent.brand.tabTitle;
    }
  }, [siteContent.brand?.tabTitle]);

  const handleToggleArchive = () => {
    setShowFullArchive((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
      return next;
    });
  };

  const handleOpenArchive = () => {
    setShowFullArchive(true);
    setTimeout(() => {
      document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // Filter photos client-side for ultra-responsive instantaneous search & tag filtering
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const searchCorpus = [
          photo.title,
          photo.description,
          photo.locomotive,
          photo.trainName,
          photo.location,
          photo.region,
          photo.cameraModel,
          photo.lens,
          photo.focalLength,
          photo.timeWeather,
          ...(photo.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchCorpus.includes(q)) return false;
      }

      // 2. Locomotive Class
      if (filters.locomotive !== "all") {
        if (filters.locomotive === "Vintage") {
          const isVintage =
            photo.locomotive.toLowerCase().includes("vintage") ||
            photo.tags?.some((t) => t.toLowerCase().includes("vintage") || t.toLowerCase().includes("steam"));
          if (!isVintage) return false;
        } else {
          if (photo.locomotive.toLowerCase() !== filters.locomotive.toLowerCase()) {
            return false;
          }
        }
      }

      // 3. Region
      if (filters.region !== "all") {
        const matchRegion =
          photo.region?.toLowerCase().includes(filters.region.toLowerCase()) ||
          photo.location?.toLowerCase().includes(filters.region.toLowerCase());
        if (!matchRegion) return false;
      }

      // 4. Year
      if (filters.year !== "all") {
        const photoYear = photo.year || new Date(photo.dateTaken).getFullYear();
        if (String(photoYear) !== String(filters.year)) return false;
      }

      // 5. Atmospheric Weather
      if (filters.weather !== "all") {
        const matchWeather =
          photo.timeWeather?.toLowerCase() === filters.weather.toLowerCase() ||
          photo.tags?.some((t) => t.toLowerCase() === filters.weather.toLowerCase());
        if (!matchWeather) return false;
      }

      return true;
    });
  }, [photos, filters]);

  const showcasePhotos = useMemo(() => {
    const featured = photos.filter((p) => p.isFeatured);
    const nonFeatured = photos.filter((p) => !p.isFeatured);
    return [...featured, ...nonFeatured].slice(0, 4);
  }, [photos]);

  // Lightbox Next & Prev logic
  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const pool = showFullArchive ? filteredPhotos : showcasePhotos;
    const currentIndex = pool.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex < pool.length - 1) {
      setSelectedPhoto(pool[currentIndex + 1]);
    } else {
      setSelectedPhoto(pool[0]);
    }
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const pool = showFullArchive ? filteredPhotos : showcasePhotos;
    const currentIndex = pool.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(pool[currentIndex - 1]);
    } else {
      setSelectedPhoto(pool[pool.length - 1]);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection
        content={siteContent.hero}
        onExploreArchive={handleOpenArchive}
      />

      {/* 2. 4-Photo Bento Collage ("Curated Mainline Archives" Vercel SaaS Style) */}
      <FeaturedCollage
        photos={photos}
        totalPhotosCount={photos.length}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        onToggleFullArchive={handleToggleArchive}
        showFullArchive={showFullArchive}
        content={siteContent.collage}
      />

      {/* 3. Expandable Complete Archive (reveals when user clicks "View Complete Archive") */}
      <AnimatePresence>
        {showFullArchive && (
          <motion.section
            id="archive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative pt-6 pb-12 border-t border-white/[0.08]"
          >
            {/* Interactive Filter & Prompt Bar */}
            <FilterPromptBar
              filters={filters}
              onFilterChange={setFilters}
              resultCount={filteredPhotos.length}
              categories={siteContent.categories}
            />

            {/* Dynamic Gallery Grid with Minimalist Bottom-Left White Overlay Cards */}
            <PhotoGrid
              photos={filteredPhotos}
              onSelectPhoto={(photo) => setSelectedPhoto(photo)}
              isLoading={isLoading}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* 4. Photographer Bio, 6-Year Journey & Gear */}
      <AboutGearSection content={siteContent.about} />

      {/* 5. Photo Lightbox Modal with Technical EXIF Spec Drawer */}
      <PhotoLightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={photos.length > 1 ? handleNextPhoto : undefined}
        onPrev={photos.length > 1 ? handlePrevPhoto : undefined}
      />
    </div>
  );
}

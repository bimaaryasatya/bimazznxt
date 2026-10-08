"use client";

import React, { useState, useEffect, useMemo } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCollage } from "@/components/FeaturedCollage";
import { FilterPromptBar } from "@/components/FilterPromptBar";
import { PhotoGrid } from "@/components/PhotoGrid";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { CreatorProfileSection } from "@/components/CreatorProfileSection";
import { AboutGearSection } from "@/components/AboutGearSection";
import { Photo, FilterState } from "@/lib/types";
import { INITIAL_PHOTOS } from "@/lib/data";
import { SiteContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { AnimatePresence, motion } from "framer-motion";

interface HomePageClientProps {
  initialPhotos?: Photo[];
  initialSiteContent?: SiteContent;
}

export function HomePageClient({
  initialPhotos,
  initialSiteContent,
}: HomePageClientProps) {
  const [photos, setPhotos] = useState<Photo[]>(
    initialPhotos && initialPhotos.length > 0 ? initialPhotos : INITIAL_PHOTOS
  );
  const [siteContent, setSiteContent] = useState<SiteContent>(
    initialSiteContent || DEFAULT_SITE_CONTENT
  );
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

  // Client-side refresh on custom events or fallback if server data was empty
  useEffect(() => {
    async function refreshData() {
      try {
        const [photoRes, contentRes] = await Promise.all([
          fetch("/api/photos"),
          fetch("/api/site-content"),
        ]);
        if (photoRes.ok) {
          const data = await photoRes.json();
          if (Array.isArray(data.photos) && data.photos.length > 0) {
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
        // Fallback silently to initial server-rendered data
      }
    }

    // Only fetch if initial server data was absent
    if (!initialPhotos || initialPhotos.length === 0) {
      refreshData();
    }

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
        refreshData();
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
  const activeLightboxPool = useMemo(() => {
    if (showFullArchive && filteredPhotos.length > 0) {
      return filteredPhotos;
    }
    return photos.length > 0 ? photos : showcasePhotos;
  }, [showFullArchive, filteredPhotos, photos, showcasePhotos]);

  const handleNextPhoto = () => {
    if (!selectedPhoto || activeLightboxPool.length === 0) return;
    const currentIndex = activeLightboxPool.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex === -1 || currentIndex >= activeLightboxPool.length - 1) {
      setSelectedPhoto(activeLightboxPool[0]);
    } else {
      setSelectedPhoto(activeLightboxPool[currentIndex + 1]);
    }
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto || activeLightboxPool.length === 0) return;
    const currentIndex = activeLightboxPool.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex <= 0) {
      setSelectedPhoto(activeLightboxPool[activeLightboxPool.length - 1]);
    } else {
      setSelectedPhoto(activeLightboxPool[currentIndex - 1]);
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

      {/* 3. Expandable Complete Archive */}
      <AnimatePresence>
        {showFullArchive && (
          <motion.section
            id="archive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative pt-6 pb-12 border-t border-zinc-200 dark:border-white/[0.08] [content-visibility:auto] [contain-intrinsic-size:1px_1000px]"
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

      {/* 4. Creator Profile Section (Section Baru: Judul, Deskripsi, Sampingnya Gambar, Bawahnya Button Medsos) */}
      <CreatorProfileSection content={siteContent.about} />

      {/* 5. Gear & Technical Arsenal Section */}
      <AboutGearSection content={siteContent.about} />

      {/* 5. Photo Lightbox Modal with Technical EXIF Spec Drawer */}
      <PhotoLightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={activeLightboxPool.length > 1 ? handleNextPhoto : undefined}
        onPrev={activeLightboxPool.length > 1 ? handlePrevPhoto : undefined}
      />
    </div>
  );
}

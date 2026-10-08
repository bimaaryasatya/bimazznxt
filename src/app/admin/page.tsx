"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminUploadForm } from "@/components/AdminUploadForm";
import { AdminPhotoTable } from "@/components/AdminPhotoTable";
import { AdminImageUploader } from "@/components/AdminImageUploader";
import { Photo } from "@/lib/types";
import { INITIAL_PHOTOS } from "@/lib/data";
import {
  SiteContent,
  DEFAULT_SITE_CONTENT,
} from "@/lib/siteContent";
import {
  Images,
  Tag,
  LayoutTemplate,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Camera,
  Layers,
  Train,
  Sliders,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Globe,
  Sun,
  Moon,
  User,
  Mail,
  Instagram,
  Youtube,
  Quote,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useApp();

  // Drawer Tab State: "galeri" | "kategori" | "profil" | "section"
  const [activeDrawerTab, setActiveDrawerTab] = useState<"galeri" | "kategori" | "profil" | "section">("galeri");
  const [gallerySubTab, setGallerySubTab] = useState<"upload" | "manage">("upload");

  // Data State
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{
    database: string;
    storage: string;
    bucket: string | null;
  }>({ database: "local_file", storage: "local_uploads", bucket: null });

  // New item inputs for Categories
  const [newLoco, setNewLoco] = useState({ id: "", label: "" });
  const [newRegion, setNewRegion] = useState({ id: "", label: "" });
  const [newWeather, setNewWeather] = useState({ id: "", label: "" });

  // New item inputs for Gear
  const [newGearBody, setNewGearBody] = useState({ name: "", role: "" });
  const [newGearOptic, setNewGearOptic] = useState({ name: "", role: "" });
  const [newGearField, setNewGearField] = useState({ name: "", role: "" });
  const [newMotivePower, setNewMotivePower] = useState("");

  // Load photos & site content
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [photoRes, contentRes, statusRes] = await Promise.all([
        fetch("/api/photos"),
        fetch("/api/site-content"),
        fetch("/api/status").catch(() => null),
      ]);

      if (photoRes.ok) {
        const pData = await photoRes.json();
        if (Array.isArray(pData.photos)) setPhotos(pData.photos);
      }
      if (contentRes.ok) {
        const cData = await contentRes.json();
        if (cData.content) setSiteContent(cData.content);
      }
      if (statusRes && statusRes.ok) {
        const sData = await statusRes.json();
        setSystemStatus(sData);
      }
    } catch (e) {
      console.warn("Could not load studio data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const handleSaveSiteContent = async (updatedContent: SiteContent, successMessage: string) => {
    setIsSavingContent(true);
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      const data = await res.json();
      if (data.content) {
        setSiteContent(data.content);
        if (typeof window !== "undefined") {
          if (data.content.brand?.tabTitle) {
            document.title = data.content.brand.tabTitle;
            try {
              localStorage.setItem("site_tab_title", data.content.brand.tabTitle);
            } catch {}
          }
          window.dispatchEvent(new Event("site-content-updated"));
        }
      }
      toast.success(successMessage);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setIsSavingContent(false);
    }
  };

  // Gallery actions
  const handlePhotoCreated = (newPhoto: Photo) => {
    setPhotos((prev) => [newPhoto, ...prev]);
    setGallerySubTab("manage");
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdatePhoto = (updatedPhoto: Photo) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p))
    );
  };

  const handleResetPhotos = async () => {
    if (!confirm("Reset archive catalog to default 9 master documentary photographs?")) return;
    try {
      setPhotos(INITIAL_PHOTOS);
      toast.success("Archive reset to default initial masterworks");
    } catch {
      toast.error("Failed to reset");
    }
  };

  // Category mutations
  const handleAddLocomotive = () => {
    if (!newLoco.id.trim() || !newLoco.label.trim()) return;
    const updated = {
      ...siteContent,
      categories: {
        ...siteContent.categories,
        locomotives: [...siteContent.categories.locomotives, { id: newLoco.id.trim(), label: newLoco.label.trim() }],
      },
    };
    setSiteContent(updated);
    setNewLoco({ id: "", label: "" });
    handleSaveSiteContent(updated, `Locomotive class "${newLoco.label}" added.`);
  };

  const handleDeleteLocomotive = (id: string) => {
    const updated = {
      ...siteContent,
      categories: {
        ...siteContent.categories,
        locomotives: siteContent.categories.locomotives.filter((l) => l.id !== id),
      },
    };
    setSiteContent(updated);
    handleSaveSiteContent(updated, "Locomotive removed.");
  };

  const handleAddRegion = () => {
    if (!newRegion.id.trim() || !newRegion.label.trim()) return;
    const updated = {
      ...siteContent,
      categories: {
        ...siteContent.categories,
        regions: [...siteContent.categories.regions, { id: newRegion.id.trim(), label: newRegion.label.trim() }],
      },
    };
    setSiteContent(updated);
    setNewRegion({ id: "", label: "" });
    handleSaveSiteContent(updated, `Territory "${newRegion.label}" added.`);
  };

  const handleDeleteRegion = (id: string) => {
    const updated = {
      ...siteContent,
      categories: {
        ...siteContent.categories,
        regions: siteContent.categories.regions.filter((r) => r.id !== id),
      },
    };
    setSiteContent(updated);
    handleSaveSiteContent(updated, "Region removed.");
  };

  const handleAddWeather = () => {
    if (!newWeather.id.trim() || !newWeather.label.trim()) return;
    const updated = {
      ...siteContent,
      categories: {
        ...siteContent.categories,
        weather: [...siteContent.categories.weather, { id: newWeather.id.trim(), label: newWeather.label.trim() }],
      },
    };
    setSiteContent(updated);
    setNewWeather({ id: "", label: "" });
    handleSaveSiteContent(updated, `Atmosphere "${newWeather.label}" added.`);
  };

  const handleDeleteWeather = (id: string) => {
    const updated = {
      ...siteContent,
      categories: {
        ...siteContent.categories,
        weather: siteContent.categories.weather.filter((w) => w.id !== id),
      },
    };
    setSiteContent(updated);
    handleSaveSiteContent(updated, "Atmosphere condition removed.");
  };

  // Gear mutations in Section tab
  const handleAddGearBody = () => {
    if (!newGearBody.name.trim()) return;
    const updated = {
      ...siteContent,
      about: {
        ...siteContent.about,
        gearBodies: [...siteContent.about.gearBodies, { name: newGearBody.name.trim(), role: newGearBody.role.trim() || "Camera Body" }],
      },
    };
    setSiteContent(updated);
    setNewGearBody({ name: "", role: "" });
    handleSaveSiteContent(updated, "Camera body added to kit.");
  };

  const handleDeleteGearBody = (index: number) => {
    const updated = {
      ...siteContent,
      about: {
        ...siteContent.about,
        gearBodies: siteContent.about.gearBodies.filter((_, i) => i !== index),
      },
    };
    setSiteContent(updated);
    handleSaveSiteContent(updated, "Camera body removed.");
  };

  const handleAddGearOptic = () => {
    if (!newGearOptic.name.trim()) return;
    const updated = {
      ...siteContent,
      about: {
        ...siteContent.about,
        gearOptics: [...siteContent.about.gearOptics, { name: newGearOptic.name.trim(), role: newGearOptic.role.trim() || "Lens" }],
      },
    };
    setSiteContent(updated);
    setNewGearOptic({ name: "", role: "" });
    handleSaveSiteContent(updated, "Optic added to kit.");
  };

  const handleDeleteGearOptic = (index: number) => {
    const updated = {
      ...siteContent,
      about: {
        ...siteContent.about,
        gearOptics: siteContent.about.gearOptics.filter((_, i) => i !== index),
      },
    };
    setSiteContent(updated);
    handleSaveSiteContent(updated, "Optic removed.");
  };

  const handleAddGearField = () => {
    if (!newGearField.name.trim()) return;
    const updated = {
      ...siteContent,
      about: {
        ...siteContent.about,
        gearField: [...siteContent.about.gearField, { name: newGearField.name.trim(), role: newGearField.role.trim() || "Field Accessory" }],
      },
    };
    setSiteContent(updated);
    setNewGearField({ name: "", role: "" });
    handleSaveSiteContent(updated, "Field equipment added to kit.");
  };

  const handleDeleteGearField = (index: number) => {
    const updated = {
      ...siteContent,
      about: {
        ...siteContent.about,
        gearField: siteContent.about.gearField.filter((_, i) => i !== index),
      },
    };
    setSiteContent(updated);
    handleSaveSiteContent(updated, "Field equipment removed.");
  };

  const handleAddMotivePower = () => {
    if (!newMotivePower.trim()) return;
    const updated = {
      ...siteContent,
      footer: {
        ...siteContent.footer,
        motivePowerList: [...(siteContent.footer?.motivePowerList || []), newMotivePower.trim()],
      },
    };
    setSiteContent(updated);
    setNewMotivePower("");
    handleSaveSiteContent(updated, "Motive power class added to footer.");
  };

  const handleDeleteMotivePower = (index: number) => {
    const updated = {
      ...siteContent,
      footer: {
        ...siteContent.footer,
        motivePowerList: (siteContent.footer?.motivePowerList || []).filter((_, i) => i !== index),
      },
    };
    setSiteContent(updated);
    handleSaveSiteContent(updated, "Motive power class removed from footer.");
  };

  return (
    <div className="min-h-screen admin-canvas bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-200">
      {/* Top Vercel SaaS Header Bar */}
      <header className="border-b border-zinc-200 dark:border-white/[0.08] bg-white/95 dark:bg-black/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs shadow-sm">
            ▲
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-zinc-500 dark:text-zinc-400">bima-archive</span>
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold uppercase tracking-wider">
              Curator Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Supabase Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-[11px] font-mono">
            <span
              className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300"
              title={
                systemStatus.database === "supabase_postgres"
                  ? "Connected to Supabase PostgreSQL Database"
                  : "Using Local File Storage (.data/photos.json)"
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  systemStatus.database === "supabase_postgres"
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : "bg-amber-400"
                }`}
              />
              <span>{systemStatus.database === "supabase_postgres" ? "Supabase DB" : "Local DB"}</span>
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">|</span>
            <span
              className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300"
              title={
                systemStatus.storage === "supabase_storage"
                  ? `Photos upload directly to Supabase Storage Bucket (${systemStatus.bucket || "photos"})`
                  : "Photos saved to local disk (public/uploads/)"
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  systemStatus.storage === "supabase_storage"
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : "bg-zinc-500"
                }`}
              />
              <span>{systemStatus.storage === "supabase_storage" ? "Supabase CDN" : "Local Disk"}</span>
            </span>
          </div>

          {/* Theme Toggle Button for Admin */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-all text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-white/[0.04]"
            title={theme === "dark" ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-cyan-600" />
            )}
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/25 text-xs text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all bg-zinc-100 dark:bg-white/[0.03]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span className="hidden sm:inline">View Public</span> Site
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 hover:border-rose-500/40 text-xs text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-300 transition-all bg-zinc-100 dark:bg-white/[0.02]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Studio Body: Drawer Navigation on Left + Workspace on Right */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 gap-8">
        {/* Left Drawer Navigation Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-3 block mb-2 font-semibold">
              Management Modules
            </span>
            <nav className="space-y-1">
              {/* Tab 1: Galeri Sendiri */}
              <button
                onClick={() => setActiveDrawerTab("galeri")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeDrawerTab === "galeri"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-md"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Images className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>Gallery & Photos</span>
                </div>
                <span className="text-[10px] font-mono opacity-70">
                  {photos.length}
                </span>
              </button>

              {/* Tab 2: Kategori Sendiri */}
              <button
                onClick={() => setActiveDrawerTab("kategori")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeDrawerTab === "kategori"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-md"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>Categories & Tags</span>
                </div>
                <span className="text-[10px] font-mono opacity-70">
                  {siteContent.categories.locomotives.length} classes
                </span>
              </button>

              {/* Tab 3: Profil Pengkarya */}
              <button
                onClick={() => setActiveDrawerTab("profil")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeDrawerTab === "profil"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-md"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>Profil Pengkarya</span>
                </div>
                <span className="text-[10px] font-mono opacity-70">
                  Bio &amp; Sosmed
                </span>
              </button>

              {/* Tab 4: Section Sendiri */}
              <button
                onClick={() => setActiveDrawerTab("section")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeDrawerTab === "section"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-md"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutTemplate className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>Page Sections CMS</span>
                </div>
                <span className="text-[10px] font-mono opacity-70">
                  Hero/Gear/Brand
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Metrics Widget */}
          <div className="admin-card p-4 rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] space-y-3 font-mono text-xs shadow-sm dark:shadow-none">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
              Live System Status
            </div>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
              <span>Catalog Records:</span>
              <span className="font-bold text-zinc-900 dark:text-white">{photos.length}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
              <span>EXIF Engine:</span>
              <span className="text-emerald-500 dark:text-emerald-400 font-semibold">exifr v7 Active</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
              <span>Persistence:</span>
              <span className="text-cyan-500 dark:text-cyan-400 font-semibold">
                {systemStatus.database === "supabase_postgres" ? "Supabase PG" : "Local Disk JSON"}
              </span>
            </div>
          </div>
        </aside>

        {/* Right Workspace Canvas */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: GALERI SENDIRI */}
          {activeDrawerTab === "galeri" && (
            <div className="space-y-6">
              {/* Header and Sub-Tab switcher */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.08] pb-4 flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                    Galeri &amp; Foto
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-white/[0.04] rounded-xl border border-zinc-200 dark:border-white/[0.08]">
                  <button
                    onClick={() => setGallerySubTab("upload")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      gallerySubTab === "upload"
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    Upload & EXIF Parse
                  </button>
                  <button
                    onClick={() => setGallerySubTab("manage")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      gallerySubTab === "manage"
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    Manage Catalog ({photos.length})
                  </button>
                </div>
              </div>

              {gallerySubTab === "upload" ? (
                <AdminUploadForm onPhotoCreated={handlePhotoCreated} />
              ) : (
                <AdminPhotoTable
                  photos={photos}
                  onDeletePhoto={handleDeletePhoto}
                  onUpdatePhoto={handleUpdatePhoto}
                  onResetPhotos={handleResetPhotos}
                />
              )}
            </div>
          )}

          {/* TAB 2: KATEGORI SENDIRI */}
          {activeDrawerTab === "kategori" && (
            <div className="space-y-8">
              <div className="border-b border-zinc-200 dark:border-white/[0.08] pb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                  Kategori &amp; Klasifikasi
                </h2>
              </div>

              {/* 1. Locomotive Series Manager */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Train className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    Locomotive Classes ({siteContent.categories.locomotives.length})
                  </h3>
                </div>

                {/* Chips Grid */}
                <div className="flex flex-wrap gap-2">
                  {siteContent.categories.locomotives.map((loco) => (
                    <div
                      key={loco.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-xs font-mono text-zinc-800 dark:text-zinc-200"
                    >
                      <span>{loco.label}</span>
                      {loco.id !== "all" && (
                        <button
                          onClick={() => handleDeleteLocomotive(loco.id)}
                          className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new locomotive form */}
                <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.06] flex items-center gap-3 flex-wrap">
                  <input
                    type="text"
                    placeholder="Class ID (e.g. CC 205)"
                    value={newLoco.id}
                    onChange={(e) => setNewLoco({ ...newLoco, id: e.target.value })}
                    className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 w-40"
                  />
                  <input
                    type="text"
                    placeholder="Display Label (e.g. CC 205 (GT38AC))"
                    value={newLoco.label}
                    onChange={(e) => setNewLoco({ ...newLoco, label: e.target.value })}
                    className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1 min-w-[200px]"
                  />
                  <button
                    onClick={handleAddLocomotive}
                    className="px-4 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Class
                  </button>
                </div>
              </div>

              {/* 2. Operational Daop Regions */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Sliders className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    Operational Regions / Daop ({siteContent.categories.regions.length})
                  </h3>
                </div>

                {/* Chips Grid */}
                <div className="flex flex-wrap gap-2">
                  {siteContent.categories.regions.map((reg) => (
                    <div
                      key={reg.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-xs font-mono text-zinc-800 dark:text-zinc-200"
                    >
                      <span>{reg.label}</span>
                      {reg.id !== "all" && (
                        <button
                          onClick={() => handleDeleteRegion(reg.id)}
                          className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new region form */}
                <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.06] flex items-center gap-3 flex-wrap">
                  <input
                    type="text"
                    placeholder="Region ID (e.g. Daop 3)"
                    value={newRegion.id}
                    onChange={(e) => setNewRegion({ ...newRegion, id: e.target.value })}
                    className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 w-40"
                  />
                  <input
                    type="text"
                    placeholder="Display Label (e.g. Daop 3 Cirebon)"
                    value={newRegion.label}
                    onChange={(e) => setNewRegion({ ...newRegion, label: e.target.value })}
                    className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1 min-w-[200px]"
                  />
                  <button
                    onClick={handleAddRegion}
                    className="px-4 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Region
                  </button>
                </div>
              </div>

              {/* 3. Atmospheric Conditions */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    Atmospheric Lighting Tags ({siteContent.categories.weather.length})
                  </h3>
                </div>

                {/* Chips Grid */}
                <div className="flex flex-wrap gap-2">
                  {siteContent.categories.weather.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-xs font-mono text-zinc-800 dark:text-zinc-200"
                    >
                      <span>{w.label}</span>
                      {w.id !== "all" && (
                        <button
                          onClick={() => handleDeleteWeather(w.id)}
                          className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new weather form */}
                <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.06] flex items-center gap-3 flex-wrap">
                  <input
                    type="text"
                    placeholder="Weather Tag (e.g. Moody Fog)"
                    value={newWeather.label}
                    onChange={(e) => setNewWeather({ id: e.target.value, label: e.target.value })}
                    className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1 min-w-[200px]"
                  />
                  <button
                    onClick={handleAddWeather}
                    className="px-4 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Atmosphere
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFIL PENGKARYA */}
          {activeDrawerTab === "profil" && (
            <div className="space-y-6">
              <div className="sticky top-[57px] bg-slate-50/95 dark:bg-black/90 backdrop-blur-md z-30 pb-4 pt-1 border-b border-zinc-200 dark:border-white/[0.08] flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-500" />
                    <span>Profil Pengkarya</span>
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Kelola judul, deskripsi biografi, foto pengkarya, dan tombol media sosial.
                  </p>
                </div>

                <button
                  onClick={() => handleSaveSiteContent(siteContent, "Profil pengkarya berhasil disimpan & diperbarui!")}
                  disabled={isSavingContent}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSavingContent ? "Menyimpan..." : "Simpan Profil"}
                </button>
              </div>

              {/* 1. Judul & Deskripsi */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-4">
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  Judul &amp; Deskripsi
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-zinc-700 dark:text-zinc-300 font-medium block mb-1.5">
                      Judul Section
                    </label>
                    <input
                      type="text"
                      value={siteContent.about.title}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, title: e.target.value },
                        })
                      }
                      placeholder="e.g. Bima Arya Satya atau Profil Pengkarya"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 dark:text-zinc-300 font-medium block mb-1.5">
                      Deskripsi Pengkarya
                    </label>
                    <textarea
                      rows={6}
                      value={siteContent.about.bio}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, bio: e.target.value },
                        })
                      }
                      placeholder="Tuliskan biografi atau deskripsi pengkarya..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Gambar Pengkarya (Sampingnya Gambar) */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-4">
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  Foto / Gambar Pengkarya (Tampil di Samping Teks)
                </h3>

                <AdminImageUploader
                  label="Upload Foto Pengkarya"
                  helperText="Foto pengkarya yang akan tampil di samping judul dan deskripsi"
                  value={siteContent.about.bioImageUrl || siteContent.about.avatarUrl || ""}
                  onChange={(url) =>
                    setSiteContent({
                      ...siteContent,
                      about: { ...siteContent.about, bioImageUrl: url, avatarUrl: url },
                    })
                  }
                  aspectRatio="wide"
                />
              </div>

              {/* 3. Button Media Sosial (Bawahnya Button Media Sosial) */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-4">
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  Tombol Media Sosial (Di Bawah Deskripsi)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-500" />
                      <span>Link Instagram</span>
                    </label>
                    <input
                      type="text"
                      value={siteContent.about.socialInstagram || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, socialInstagram: e.target.value },
                        })
                      }
                      placeholder="e.g. https://instagram.com/bimazznxt"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-500" />
                      <span>Link YouTube</span>
                    </label>
                    <input
                      type="text"
                      value={siteContent.about.socialYoutube || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, socialYoutube: e.target.value },
                        })
                      }
                      placeholder="e.g. https://youtube.com/@bimazznxt"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Email Kontak</span>
                    </label>
                    <input
                      type="email"
                      value={siteContent.about.socialEmail || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, socialEmail: e.target.value },
                        })
                      }
                      placeholder="e.g. bimaaryasatya@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Link X (Twitter) / Web</span>
                    </label>
                    <input
                      type="text"
                      value={siteContent.about.socialX || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, socialX: e.target.value },
                        })
                      }
                      placeholder="e.g. https://x.com/bimazznxt"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Save Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSaveSiteContent(siteContent, "Profil pengkarya berhasil disimpan & diperbarui!")}
                  disabled={isSavingContent}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSavingContent ? "Menyimpan..." : "Simpan Profil Pengkarya"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SECTION SENDIRI (PAGE SECTIONS CMS) */}
          {activeDrawerTab === "section" && (
            <div className="space-y-8">
              <div className="sticky top-[57px] bg-slate-50/95 dark:bg-black/90 backdrop-blur-md z-30 pb-4 pt-1 border-b border-zinc-200 dark:border-white/[0.08] flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                    Konten Halaman
                  </h2>
                </div>

                <button
                  onClick={() => handleSaveSiteContent(siteContent, "Semua perubahan konten berhasil disimpan!")}
                  disabled={isSavingContent}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  {isSavingContent ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>

              {/* 0. Browser Tab & Navbar Brand CMS */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    Title Tab &amp; Navbar
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-black/60 border border-zinc-200 dark:border-white/10 text-xs">
                    <span className="text-zinc-500 text-[10px] uppercase font-mono">Preview Tab:</span>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/tab-icon.png" alt="Tab Icon" className="w-3.5 h-3.5 rounded-sm object-contain" />
                      <span className="text-[11px] font-medium truncate max-w-[220px]">
                        {siteContent.brand?.tabTitle || "BIMA | Railway Documentary Photography Archive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Browser Tab Title Input */}
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 font-medium text-xs block mb-1.5">
                    Title Tab Browser
                  </label>
                  <input
                    type="text"
                    value={siteContent.brand?.tabTitle || ""}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setSiteContent({
                        ...siteContent,
                        brand: {
                          ...siteContent.brand,
                          tabTitle: newTitle,
                        },
                      });
                      if (typeof document !== "undefined" && newTitle.trim()) {
                        document.title = newTitle;
                      }
                    }}
                    placeholder="e.g. BIMA | Railway Documentary Photography Archive"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans text-xs transition-colors"
                  />
                </div>

                {/* Navbar Header Section */}
                <div className="border-t border-zinc-200 dark:border-white/[0.06] pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                      Navbar Header Text
                    </span>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono">Navbar:</span>
                      <div className="flex items-center gap-1.5 font-jakarta font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain hidden dark:block" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo-dark.png" alt="Logo" className="w-4 h-4 object-contain block dark:hidden" />
                        <span>{siteContent.brand?.name || "BIMA"}</span>
                        {siteContent.brand?.tag && (
                          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                            {siteContent.brand.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Brand Name</label>
                      <input
                        type="text"
                        value={siteContent.brand?.name || ""}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            brand: {
                              ...siteContent.brand,
                              name: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. BIMA"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Suffix Tag</label>
                      <input
                        type="text"
                        value={siteContent.brand?.tag || ""}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            brand: {
                              ...siteContent.brand,
                              tag: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. / archive"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Hero Section CMS */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-4">
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  Hero Section
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Headline Prefix</label>
                    <input
                      type="text"
                      value={siteContent.hero.headline}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, headline: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Headline Highlight (Gradient)</label>
                    <input
                      type="text"
                      value={siteContent.hero.headlineHighlight}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, headlineHighlight: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Subtitle / Documentary Statement</label>
                    <textarea
                      rows={3}
                      value={siteContent.hero.subtitle}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Primary CTA Button</label>
                    <input
                      type="text"
                      value={siteContent.hero.ctaPrimaryText}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, ctaPrimaryText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Secondary CTA Button</label>
                    <input
                      type="text"
                      value={siteContent.hero.ctaSecondaryText}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, ctaSecondaryText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* 1.5. Curated Mainline Collage Showcase CMS */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-4">
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Images className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  Collage Showcase (4-Photo Bento)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Showcase Title</label>
                    <input
                      type="text"
                      value={siteContent.collage?.title || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          collage: {
                            ...siteContent.collage,
                            title: e.target.value,
                            subtitle: siteContent.collage?.subtitle || "",
                          },
                        })
                      }
                      placeholder="e.g. Curated Mainline Archives"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Showcase Subtitle</label>
                    <input
                      type="text"
                      value={siteContent.collage?.subtitle || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          collage: {
                            ...siteContent.collage,
                            title: siteContent.collage?.title || "",
                            subtitle: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Curated master railway documentation from 6 years of field archives."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Profil Pengkarya (Section Baru) */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    Profil Pengkarya (Section Baru)
                  </h3>
                  <button
                    onClick={() => setActiveDrawerTab("profil")}
                    className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Buka Editor Profil Lengkap &rarr;
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Judul Section</label>
                    <input
                      type="text"
                      value={siteContent.about.title}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, title: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Deskripsi Biografi</label>
                    <textarea
                      rows={4}
                      value={siteContent.about.bio}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, bio: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <AdminImageUploader
                      label="Foto Pengkarya (Tampil di Samping Teks)"
                      value={siteContent.about.bioImageUrl || siteContent.about.avatarUrl || ""}
                      onChange={(url) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, bioImageUrl: url, avatarUrl: url },
                        })
                      }
                      aspectRatio="wide"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Gear & Equipment Arsenal CMS */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-6">
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  Gear &amp; Optical Arsenal
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Technical Arsenal Title</label>
                    <input
                      type="text"
                      value={siteContent.about.gearTitle || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, gearTitle: e.target.value },
                        })
                      }
                      placeholder="e.g. Technical Arsenal"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Technical Arsenal Subtitle / Statement</label>
                    <input
                      type="text"
                      value={siteContent.about.gearSubtitle || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, gearSubtitle: e.target.value },
                        })
                      }
                      placeholder="e.g. High-speed shutter bodies, telephoto glass, and rugged trackside stabilizers..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  {/* Gear Image with File Uploader */}
                  <div className="sm:col-span-2 pt-2">
                    <AdminImageUploader
                      label="Foto Equipment / Gear"
                      value={siteContent.about.gearImageUrl || ""}
                      onChange={(url) =>
                        setSiteContent({
                          ...siteContent,
                          about: { ...siteContent.about, gearImageUrl: url },
                        })
                      }
                      aspectRatio="video"
                    />
                  </div>
                </div>

                {/* Camera Bodies */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 font-semibold block">
                    Camera Bodies ({siteContent.about.gearBodies.length})
                  </span>
                  <div className="space-y-2">
                    {siteContent.about.gearBodies.map((gear, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] text-xs font-mono"
                      >
                        <div>
                          <span className="text-zinc-900 dark:text-zinc-200 font-bold block">{gear.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">{gear.role}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteGearBody(idx)}
                          className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Add body input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Model (e.g. Sony A7R V)"
                      value={newGearBody.name}
                      onChange={(e) => setNewGearBody({ ...newGearBody, name: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Studio backup)"
                      value={newGearBody.role}
                      onChange={(e) => setNewGearBody({ ...newGearBody, role: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1"
                    />
                    <button
                      onClick={handleAddGearBody}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold text-xs shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Optics */}
                <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-white/[0.06]">
                  <span className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 font-semibold block">
                    Optics &amp; Lenses ({siteContent.about.gearOptics.length})
                  </span>
                  <div className="space-y-2">
                    {siteContent.about.gearOptics.map((gear, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] text-xs font-mono"
                      >
                        <div>
                          <span className="text-zinc-900 dark:text-zinc-200 font-bold block">{gear.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">{gear.role}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteGearOptic(idx)}
                          className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Add optic input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Lens (e.g. FE 50mm F1.2 GM)"
                      value={newGearOptic.name}
                      onChange={(e) => setNewGearOptic({ ...newGearOptic, name: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Dusk portrait)"
                      value={newGearOptic.role}
                      onChange={(e) => setNewGearOptic({ ...newGearOptic, role: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1"
                    />
                    <button
                      onClick={handleAddGearOptic}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold text-xs shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Field Accessories */}
                <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-white/[0.06]">
                  <span className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 font-semibold block">
                    Field Accessories ({siteContent.about.gearField.length})
                  </span>
                  <div className="space-y-2">
                    {siteContent.about.gearField.map((gear, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] text-xs font-mono"
                      >
                        <div>
                          <span className="text-zinc-900 dark:text-zinc-200 font-bold block">{gear.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">{gear.role}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteGearField(idx)}
                          className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Add field accessory input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Tool (e.g. Anker 737 Powerbank)"
                      value={newGearField.name}
                      onChange={(e) => setNewGearField({ ...newGearField, name: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. All-day trackside power)"
                      value={newGearField.role}
                      onChange={(e) => setNewGearField({ ...newGearField, role: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1"
                    />
                    <button
                      onClick={handleAddGearField}
                      className="px-4 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold text-xs shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Footer Section Content CMS */}
              <div className="admin-card border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 bg-white dark:bg-white/[0.01] shadow-sm dark:shadow-none space-y-6">
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  Footer Section
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Brand / Title</label>
                    <input
                      type="text"
                      value={siteContent.footer?.brandTitle || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          footer: { ...siteContent.footer, brandTitle: e.target.value },
                        })
                      }
                      placeholder="e.g. BIMA RAILWAY ARCHIVE"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Deskripsi Arsip</label>
                    <textarea
                      rows={3}
                      value={siteContent.footer?.description || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          footer: { ...siteContent.footer, description: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Header Motive Power</label>
                    <input
                      type="text"
                      value={siteContent.footer?.motivePowerTitle || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          footer: { ...siteContent.footer, motivePowerTitle: e.target.value },
                        })
                      }
                      placeholder="e.g. Documented Motive Power"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  {/* Motive Power List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 font-semibold block">
                      Documented Motive Power List ({(siteContent.footer?.motivePowerList || []).length})
                    </span>
                    <div className="space-y-2">
                      {(siteContent.footer?.motivePowerList || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] text-xs font-mono"
                        >
                          <span className="text-zinc-900 dark:text-zinc-200">{item}</span>
                          <button
                            onClick={() => handleDeleteMotivePower(idx)}
                            className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add motive power item */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="e.g. GE CM20EMP (CC 206 Series)"
                        value={newMotivePower}
                        onChange={(e) => setNewMotivePower(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 flex-1"
                      />
                      <button
                        onClick={handleAddMotivePower}
                        className="px-4 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Class
                      </button>
                    </div>
                  </div>

                  {/* Copyright Notice */}
                  <div className="pt-2">
                    <label className="text-zinc-600 dark:text-zinc-400 block mb-1.5 font-medium">Copyright Notice</label>
                    <input
                      type="text"
                      value={siteContent.footer?.copyright || ""}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          footer: { ...siteContent.footer, copyright: e.target.value },
                        })
                      }
                      placeholder="e.g. © 2019–2025 Bima Railway Archive. All rights reserved. High-resolution raw files archived."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

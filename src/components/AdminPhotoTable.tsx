"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";
import {
  Trash2,
  Edit2,
  Camera,
  Train,
  MapPin,
  Calendar,
  AlertTriangle,
  ExternalLink,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface AdminPhotoTableProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
  onUpdatePhoto: (photo: Photo) => void;
  onResetPhotos: () => void;
}

export function AdminPhotoTable({
  photos,
  onDeletePhoto,
  onUpdatePhoto,
  onResetPhotos,
}: AdminPhotoTableProps) {
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingShowcaseId, setTogglingShowcaseId] = useState<string | null>(null);

  const handleToggleShowcase = async (photo: Photo) => {
    setTogglingShowcaseId(photo.id);
    const nextStatus = !photo.isFeatured;
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextStatus }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui status showcase");
      const { photo: updatedPhoto } = await res.json();
      onUpdatePhoto(updatedPhoto);
      toast.success(
        nextStatus
          ? `"${photo.title}" diaktifkan di Showcase`
          : `"${photo.title}" dinonaktifkan dari Showcase`
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status showcase");
    } finally {
      setTogglingShowcaseId(null);
    }
  };

  const confirmDelete = async () => {
    if (!photoToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/photos/${photoToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete photograph");

      onDeletePhoto(photoToDelete.id);
      toast.success("Photograph removed from archive");
      setPhotoToDelete(null);
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      const res = await fetch(`/api/photos/${editingPhoto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPhoto),
      });

      if (!res.ok) throw new Error("Failed to update photograph");
      const { photo } = await res.json();
      onUpdatePhoto(photo);
      toast.success("Photograph updated successfully");
      setEditingPhoto(null);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with count and reset option */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Train className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            Photos Catalog ({photos.length})
          </h3>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3 h-3 fill-cyan-500/30" />
            Showcase: {photos.filter((p) => p.isFeatured).length} aktif
          </span>
        </div>

        <button
          onClick={onResetPhotos}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-xs text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-white/10 transition-all font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Default Seed
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-950/40 shadow-sm dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.02] text-zinc-600 dark:text-zinc-400 font-mono">
                <th className="py-3 px-4">Photograph</th>
                <th className="py-3 px-4">Locomotive & Line</th>
                <th className="py-3 px-4">Technical EXIF</th>
                <th className="py-3 px-4">Date Taken</th>
                <th className="py-3 px-4 text-center">Showcase</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/[0.05]">
              {photos.map((photo) => (
                <tr
                  key={photo.id}
                  className="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Photo & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-black">
                        <Image
                          src={photo.thumbnailUrl || photo.imageUrl}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-[200px]">
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          {photo.title}
                        </div>
                        {photo.trainName && (
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono truncate">
                            KA {photo.trainName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Locomotive & Location */}
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                        {photo.locomotive}
                      </span>
                      <div className="text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1 text-[11px] truncate max-w-[220px]">
                        <MapPin className="w-3 h-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
                        <span className="truncate">{photo.location}</span>
                      </div>
                    </div>
                  </td>

                  {/* EXIF Metadata Badges */}
                  <td className="py-3 px-4">
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="text-zinc-700 dark:text-zinc-300 flex items-center gap-1 truncate max-w-[240px]">
                        <Camera className="w-3 h-3 text-cyan-500 dark:text-cyan-400 shrink-0" />
                        <span className="truncate">
                          {photo.cameraModel || "Manual Log"}
                        </span>
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-400">
                        {photo.focalLength || "—"} • {photo.aperture || "—"} •{" "}
                        {photo.shutterSpeed || "—"} • {photo.iso || "—"}
                      </div>
                    </div>
                  </td>

                  {/* Date Taken */}
                  <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400 font-mono">
                    {formatDate(photo.dateTaken)}
                  </td>

                  {/* Showcase Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleShowcase(photo)}
                      disabled={togglingShowcaseId === photo.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                        photo.isFeatured
                          ? "bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                          : "bg-zinc-100 hover:bg-zinc-200/80 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-300"
                      }`}
                      title={
                        photo.isFeatured
                          ? "Foto aktif di Showcase Bento Grid. Klik untuk menonaktifkan."
                          : "Klik untuk mengaktifkan di Showcase Bento Grid"
                      }
                    >
                      {togglingShowcaseId === photo.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-500" />
                      ) : (
                        <Sparkles
                          className={`w-3.5 h-3.5 ${
                            photo.isFeatured
                              ? "fill-cyan-500 text-cyan-600 dark:fill-cyan-400 dark:text-cyan-400"
                              : "text-zinc-400 dark:text-zinc-500"
                          }`}
                        />
                      )}
                      <span>{photo.isFeatured ? "Active" : "Activate"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingPhoto(photo)}
                        className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-white/[0.05] transition-all"
                        title="Edit photo details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setPhotoToDelete(photo)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 border border-rose-500/20 transition-all"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="p-6 rounded-2xl max-w-md w-full bg-white dark:bg-zinc-950 border border-rose-500/30 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Delete Photograph from Archive?
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                Are you sure you want to permanently remove{" "}
                <span className="text-zinc-900 dark:text-zinc-200 font-semibold">
                  "{photoToDelete.title}"
                </span>
                ? This action will remove the record from public view and master database archives.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-medium text-white shadow-lg shadow-rose-600/30"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <form
            onSubmit={saveEdit}
            className="p-6 sm:p-8 rounded-2xl max-w-xl w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/20 space-y-4 shadow-2xl my-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                Edit Photographic Archive
              </h3>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  value={editingPhoto.title}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-medium">Train Service Name</label>
                <input
                  type="text"
                  value={editingPhoto.trainName || ""}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      trainName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-medium">Spot Location</label>
                <input
                  type="text"
                  value={editingPhoto.location}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-medium">Camera</label>
                  <input
                    type="text"
                    value={editingPhoto.cameraModel || ""}
                    onChange={(e) =>
                      setEditingPhoto({
                        ...editingPhoto,
                        cameraModel: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-medium">Lens</label>
                  <input
                    type="text"
                    value={editingPhoto.lens || ""}
                    onChange={(e) =>
                      setEditingPhoto({
                        ...editingPhoto,
                        lens: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-medium">Narrative Description</label>
                <textarea
                  rows={3}
                  value={editingPhoto.description || ""}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans resize-none"
                />
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-white/10">
                <label className="flex items-center gap-2.5 cursor-pointer text-zinc-800 dark:text-zinc-200 select-none">
                  <input
                    type="checkbox"
                    checked={!!editingPhoto.isFeatured}
                    onChange={(e) =>
                      setEditingPhoto({
                        ...editingPhoto,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 bg-zinc-100 dark:bg-white/[0.05]"
                  />
                  <div className="flex items-center gap-1.5 font-medium text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                    <span>Tampilkan di Showcase Section (4-Photo Bento Grid)</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-black shadow-lg shadow-cyan-500/25"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

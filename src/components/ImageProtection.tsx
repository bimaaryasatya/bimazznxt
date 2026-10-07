"use client";

import { useEffect } from "react";

/**
 * ImageProtection
 * Enforces client-side protection for all portfolio photographs and digital assets:
 * 1. Blocks right-click context menu (Save image as..., Copy image, Inspect image).
 * 2. Blocks drag & drop of images to desktop, tab bar, or other windows.
 * 3. Blocks keyboard shortcut Ctrl+S / Cmd+S (Save webpage / assets).
 * 4. Intercepts touch-and-hold context menus on mobile devices.
 */
export function ImageProtection() {
  useEffect(() => {
    // 1. Block Context Menu on images, media, and photo containers
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (
        target.tagName === "IMG" ||
        target.tagName === "PICTURE" ||
        target.tagName === "CANVAS" ||
        target.closest("img") ||
        target.closest("picture") ||
        target.closest(".protected-image") ||
        target.closest(".photo-lightbox") ||
        target.closest("[data-protected]")
      ) {
        e.preventDefault();
      }
    };

    // 2. Block Dragging of Images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (
        target.tagName === "IMG" ||
        target.tagName === "PICTURE" ||
        target.closest("img") ||
        target.closest(".protected-image") ||
        target.closest("[data-protected]")
      ) {
        e.preventDefault();
      }
    };

    // 3. Block Save Webpage shortcut (Ctrl+S / Cmd+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("dragstart", handleDragStart, { capture: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      document.removeEventListener("dragstart", handleDragStart, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}

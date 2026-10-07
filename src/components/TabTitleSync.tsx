"use client";

import { useEffect } from "react";

export function TabTitleSync() {
  useEffect(() => {
    const updateTitleAndFavicon = async () => {
      try {
        const res = await fetch("/api/site-content");
        if (res.ok) {
          const data = await res.json();
          if (data.content?.brand?.tabTitle) {
            document.title = data.content.brand.tabTitle;
          }
        }
      } catch {
        // Fallback silently
      }

      // Ensure favicon link in document head points to /tab-icon.png
      try {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = "/tab-icon.png";
      } catch {
        // Fallback silently
      }
    };

    updateTitleAndFavicon();

    const handleContentUpdated = () => {
      updateTitleAndFavicon();
    };

    // Update on event, focus, or visibility change
    window.addEventListener("site-content-updated", handleContentUpdated);
    window.addEventListener("focus", updateTitleAndFavicon);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) updateTitleAndFavicon();
    });

    return () => {
      window.removeEventListener("site-content-updated", handleContentUpdated);
      window.removeEventListener("focus", updateTitleAndFavicon);
    };
  }, []);

  return null;
}

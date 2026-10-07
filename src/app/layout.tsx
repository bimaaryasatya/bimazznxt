import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AmbientAurora } from "@/components/AmbientAurora";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppContext";
import { TabTitleSync } from "@/components/TabTitleSync";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "BIMA | 6-Year Railway Documentary Photography Archive",
  description:
    "A premier railway photography archive documenting 6 years of Indonesian railway heritage, locomotives CC 201, CC 203, CC 206, and iconic mainline lines with verified EXIF data.",
  icons: {
    icon: [
      { url: "/tab-icon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/tab-icon.png",
    apple: "/tab-icon.png",
  },
  keywords: [
    "railway photography",
    "locomotive archive",
    "CC 206",
    "CC 201",
    "CC 203",
    "kereta api indonesia",
    "daop 5",
    "sakalibel",
    "cikubang",
    "exif photography",
  ],
  authors: [{ name: "Bima - Railway Documentary Photographer" }],
};

import { getSiteContent } from "@/lib/siteContentServer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSiteContent().catch(() => null);

  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/tab-icon.png" type="image/png" />
      </head>
      <body className="bg-canvas text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-white transition-colors duration-200">
        <AppProvider>
          <TabTitleSync />
          <AmbientAurora />
          <Navbar initialBrand={siteContent?.brand} />
          <main className="relative z-10 min-h-screen pt-20">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "rgba(18, 18, 22, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(16px)",
                color: "#f4f4f5",
              },
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}

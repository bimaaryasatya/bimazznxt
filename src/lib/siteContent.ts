export interface HeroContent {
  headline: string;
  headlineHighlight: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
}

export interface AboutContent {
  title: string;
  bio: string;
  photographerName: string;
  photographerRole: string;
  regionCoverage: string;
  bioImageUrl?: string;
  gearTitle?: string;
  gearSubtitle?: string;
  gearImageUrl?: string;
  gearBodies: { name: string; role: string }[];
  gearOptics: { name: string; role: string }[];
  gearField: { name: string; role: string }[];
}

export interface CollageContent {
  title: string;
  subtitle: string;
}

export interface CategoryContent {
  locomotives: { id: string; label: string }[];
  regions: { id: string; label: string }[];
  weather: { id: string; label: string }[];
}

export interface BrandContent {
  name: string;
  tag: string;
  tabTitle?: string;
}

export interface FooterContent {
  brandTitle: string;
  description: string;
  motivePowerTitle: string;
  motivePowerList: string[];
  copyright: string;
}

export interface SiteContent {
  brand: BrandContent;
  hero: HeroContent;
  collage: CollageContent;
  about: AboutContent;
  categories: CategoryContent;
  footer: FooterContent;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    name: "BIMA",
    tag: "/ archive",
    tabTitle: "BIMA | 6-Year Railway Documentary Photography Archive",
  },
  hero: {
    headline: "The Raw Soul of",
    headlineHighlight: "Indonesian Steel Rails.",
    subtitle:
      "Six relentless years trackside. Documenting diesel-electric motive power, high-mountain viaducts, curved superelevations, and atmospheric monsoon crossings across Java Island with uncompromising optical precision.",
    ctaPrimaryText: "Explore Master Archive",
    ctaSecondaryText: "About & Gear",
  },
  collage: {
    title: "Curated Mainline Archives",
    subtitle: "Curated master railway documentation from six years of mainline trackside chronicles.",
  },
  about: {
    title: "Six Years on Java’s Mainlines.",
    bio: "A documentary chronicle dedicated to the heavy diesel-electric motive power, high-mountain viaducts, and curved superelevations across Java Island. Trackside since late 2019 with strict optical discipline and direct EXIF sensor preservation.",
    photographerName: "Bima",
    photographerRole: "Documentary Photographer",
    regionCoverage: "Daop 1 — Daop 9",
    bioImageUrl: "https://images.unsplash.com/photo-1515165562839-978bbcf18277?q=80&w=1200&auto=format&fit=crop",
    gearTitle: "Technical Arsenal",
    gearSubtitle: "High-speed shutter bodies, telephoto glass, and rugged trackside stabilizers built for high-tempo mainline documentary work.",
    gearImageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    gearBodies: [
      { name: "Sony Alpha 7 IV", role: "Primary mainline body" },
      { name: "Nikon D750", role: "Severe weather & long exp" },
      { name: "Canon EOS R6", role: "High-speed shutter tracks" },
    ],
    gearOptics: [
      { name: "FE 70-200mm F2.8 GM II", role: "Telephoto curve tracking" },
      { name: "FE 24-70mm F2.8 GM II", role: "Viaducts & wide landscape" },
      { name: "FE 135mm F1.8 GM", role: "Low-light portrait prime" },
    ],
    gearField: [
      { name: "Gitzo Carbon Series 3", role: "Track ballast dampening" },
      { name: "Haida Nano-Pro CPL/ND", role: "Sky & water reflection cut" },
      { name: "VHF Radio Scanner", role: "Live dispatch sync" },
    ],
  },
  categories: {
    locomotives: [
      { id: "all", label: "All Classes" },
      { id: "CC 206", label: "CC 206 (CM20EMP)" },
      { id: "CC 201", label: "CC 201 (U18C)" },
      { id: "CC 203", label: "CC 203 (U20C)" },
      { id: "Vintage", label: "Heritage / Steam" },
    ],
    regions: [
      { id: "all", label: "All Daop" },
      { id: "Daop 1", label: "Daop 1 Jakarta" },
      { id: "Daop 2", label: "Daop 2 Bandung" },
      { id: "Daop 5", label: "Daop 5 Purwokerto" },
      { id: "Daop 6", label: "Daop 6 Yogyakarta" },
    ],
    weather: [
      { id: "all", label: "All Atmospheric" },
      { id: "Golden Hour", label: "Golden Hour" },
      { id: "Night", label: "Night & Midnight" },
      { id: "Rainy", label: "Rainy Season" },
      { id: "Daylight", label: "Crisp Daylight" },
    ],
  },
  footer: {
    brandTitle: "Bima Railway Archive",
    description:
      "Dedicated to documenting the golden age and evolution of Indonesian railway infrastructure. Over six years of trackside vigils capturing locomotives, viaducts, switchbacks, and atmospheric mainline crossings.",
    motivePowerTitle: "Documented Motive Power",
    motivePowerList: [
      "GE CM20EMP (CC 206 Series)",
      "GE U20C Aerodynamic (CC 203)",
      "GE U18C Heritage Workhorse (CC 201)",
      "Preserved Hydraulic & Steam Shunters",
    ],
    copyright: "© 2019–2025 Bima Railway Archive. All rights reserved. High-resolution raw files archived.",
  },
};

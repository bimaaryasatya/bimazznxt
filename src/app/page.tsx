import { getPhotos } from "@/lib/db";
import { getSiteContent } from "@/lib/siteContentServer";
import { HomePageClient } from "@/components/HomePageClient";

// Incremental Static Regeneration (ISR): cache at the edge for 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const [photos, siteContent] = await Promise.all([
    getPhotos().catch(() => []),
    getSiteContent(),
  ]);

  return (
    <HomePageClient
      initialPhotos={photos}
      initialSiteContent={siteContent}
    />
  );
}

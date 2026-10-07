import { SiteContent } from "./siteContent";
import { getSiteContentFromDb, updateSiteContentInDb } from "@/db";

export async function getSiteContent(): Promise<SiteContent> {
  return getSiteContentFromDb();
}

export async function updateSiteContent(updates: Partial<SiteContent>): Promise<SiteContent> {
  return updateSiteContentInDb(updates);
}

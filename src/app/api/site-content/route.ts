import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/siteContentServer";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();
    const updated = await updateSiteContent(updates);
    return NextResponse.json({ success: true, content: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save content" }, { status: 500 });
  }
}

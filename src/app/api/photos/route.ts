import { NextRequest, NextResponse } from "next/server";
import { getPhotos, createPhoto } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || undefined;
    const locomotive = searchParams.get("locomotive") || undefined;
    const region = searchParams.get("region") || undefined;
    const year = searchParams.get("year") || undefined;
    const weather = searchParams.get("weather") || undefined;

    const photos = await getPhotos({
      searchQuery,
      locomotive,
      region,
      year,
      weather,
    });

    return NextResponse.json({ photos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch photos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.imageUrl || !body.locomotive || !body.location) {
      return NextResponse.json(
        { error: "Title, image URL, locomotive class, and location are required." },
        { status: 400 }
      );
    }

    const created = await createPhoto(body);
    return NextResponse.json({ photo: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create photo" }, { status: 500 });
  }
}

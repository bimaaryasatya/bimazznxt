import { NextRequest, NextResponse } from "next/server";
import { getPhotoById, updatePhoto, deletePhoto } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const photo = await getPhotoById(id);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
    return NextResponse.json({ photo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch photo" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const updated = await updatePhoto(id, body);

    if (!updated) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({ photo: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update photo" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deletePhoto(id);

    if (!deleted) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Photo deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete photo" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createAdminSession, destroyAdminSession, isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  return NextResponse.json({ authenticated: authed });
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const isValid = await verifyAdminCredentials(password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 });
  }
}

export async function DELETE() {
  await destroyAdminSession();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "railway_admin_token";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "railway2024!";
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@railwayarchive.io";
const SESSION_SECRET = process.env.SESSION_SECRET || "railway-archive-secret-key-6-years";

export async function verifyAdminCredentials(password: string): Promise<boolean> {
  return password === DEFAULT_ADMIN_PASSWORD;
}

export async function createAdminSession(): Promise<string> {
  const token = Buffer.from(
    JSON.stringify({
      role: "admin",
      user: DEFAULT_ADMIN_EMAIL,
      createdAt: Date.now(),
      secret: SESSION_SECRET,
    })
  ).toString("base64");

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;

    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return decoded.role === "admin" && decoded.secret === SESSION_SECRET;
  } catch {
    return false;
  }
}

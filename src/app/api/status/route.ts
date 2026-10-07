import { NextResponse } from "next/server";
import { isDrizzleActive } from "@/db";
import { isSupabaseStorageActive, SUPABASE_BUCKET_NAME } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    database: isDrizzleActive ? "supabase_postgres" : "local_file",
    storage: isSupabaseStorageActive ? "supabase_storage" : "local_uploads",
    bucket: isSupabaseStorageActive ? SUPABASE_BUCKET_NAME : null,
  });
}

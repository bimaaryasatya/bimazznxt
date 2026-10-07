-- ============================================================================
-- SUPABASE DATABASE SETUP SCRIPT FOR RAILWAY ARCHIVE PORTFOLIO
-- ============================================================================
-- Jalankan skrip SQL ini di Supabase Dashboard:
-- 1. Buka project Supabase Anda -> menu "SQL Editor" di bilah kiri
-- 2. Klik "New Query", paste seluruh kode di bawah ini, lalu klik "Run"
-- ============================================================================

-- 1. TABEL PHOTOS (Menyimpan Metadata Foto & Data EXIF Kamera)
CREATE TABLE IF NOT EXISTS photos (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  camera_model VARCHAR(128),
  lens_model VARCHAR(128),
  focal_length VARCHAR(64),
  aperture VARCHAR(64),
  shutter_speed VARCHAR(64),
  iso INTEGER,
  locomotive VARCHAR(128) NOT NULL,
  train_name VARCHAR(128),
  location VARCHAR(255) NOT NULL,
  region VARCHAR(128) NOT NULL,
  date_taken VARCHAR(64) NOT NULL,
  year INTEGER,
  tags JSONB DEFAULT '[]'::jsonb,
  aspect_ratio VARCHAR(32) DEFAULT '16:9',
  featured BOOLEAN DEFAULT false,
  time_weather VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeks untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_photos_locomotive ON photos (locomotive);
CREATE INDEX IF NOT EXISTS idx_photos_region ON photos (region);
CREATE INDEX IF NOT EXISTS idx_photos_featured ON photos (featured);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Policy: Publik bisa membaca/melihat seluruh foto galeri
CREATE POLICY "Public Read Photos" 
ON photos 
FOR SELECT 
USING (true);

-- Policy: Insert / Update / Delete dilakukan oleh server backend (menggunakan connection string atau service role)
CREATE POLICY "Service Role Full Access Photos" 
ON photos 
FOR ALL 
USING (true)
WITH CHECK (true);


-- 2. TABEL SITE_CONTENT (Menyimpan CMS Text, Hero, Brand, Tab Title, About, Gear)
CREATE TABLE IF NOT EXISTS site_content (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'main',
  brand JSONB NOT NULL,
  hero JSONB NOT NULL,
  collage JSONB,
  about JSONB NOT NULL,
  categories JSONB NOT NULL,
  footer JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policy: Publik bisa membaca konten teks website
CREATE POLICY "Public Read Site Content" 
ON site_content 
FOR SELECT 
USING (true);

-- Policy: Service role bisa update konten website
CREATE POLICY "Service Role Full Access Site Content" 
ON site_content 
FOR ALL 
USING (true)
WITH CHECK (true);


-- ============================================================================
-- 3. STORAGE BUCKET (Untuk Menyimpan File Foto Asli)
-- ============================================================================
-- Catatan untuk Supabase Storage:
-- 1. Buka menu "Storage" di bilah kiri Supabase Dashboard.
-- 2. Klik "New Bucket", beri nama: photos
-- 3. Centang "Public bucket" agar foto bisa diakses oleh pengunjung web.
-- 4. Klik "Save bucket".
--
-- Policy Storage (Opsional jika ingin mengatur via SQL):
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: Izinkan publik melihat/mengunduh foto dari bucket 'photos'
CREATE POLICY "Public Access Photos Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Policy: Izinkan upload foto ke bucket 'photos'
CREATE POLICY "Allow Upload to Photos Bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photos');

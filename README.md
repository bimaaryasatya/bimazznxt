# BIMA | 6-Year Railway Documentary Photography Archive 🚂📷

A modern, high-performance photography portfolio website engineered for documenting six years of Indonesian railway archives (2019–2025). Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Lucide React**, and client-side **`exifr`** metadata parsing, fully optimized for deployment on Vercel.

---

## 🎨 1. Design Theme & Aesthetics (Linear / Modern Dark AI Style)

- **Deep Ultra-Dark Canvas**: Base background `#030303` to `#09090b` overlaid with a subtle CSS dot-grid pattern (`radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`).
- **Ambient Aurora Gradients**: Soft, slowly drifting mesh gradients (violet, cyan, and indigo) utilizing GPU-accelerated keyframe animations (`animate-aurora-slow` & `animate-aurora-reverse`) with `blur-[140px]`.
- **Frosted Glassmorphism**: Translucent panels (`backdrop-blur-xl`, `bg-white/[0.03]`, `border border-white/[0.08]`) with soft inner border highlights and subtle glow accents.
- **Typography**: Geometric sans-serif (Inter) with strict typographic hierarchy, high-contrast monospace technical badges, and gradient text highlights.

---

## ⚡ 2. Motion & Animation System (Framer Motion Spring Physics)

All interactive animations adhere to realistic spring physics (`damping: 25`, `stiffness: 200`):
- **Hero Section**: Staggered reveal for headline typography, documentary metrics, and call-to-action buttons on page load.
- **Filter / Prompt Bar**:
  - Linear/Prompt-style search bar with focus expansion, ring glow, and instant client-side filtering.
  - Locomotive class active slider using Framer Motion's `layoutId="activeLocomotivePill"`.
  - Expandable advanced drawer for Daop Region (Daop 1 – Daop 9), Chronology Year (2019–2025), and Atmospheric Weather (Golden Hour, Night, Monsoon Rainy).
- **Gallery Grid**:
  - Staggered scroll-triggered fade-in and slide-up for photo cards (`staggerChildren: 0.08s`).
  - Progressive blur-up transition with placeholder shimmer effect.
  - Hover micro-interactions: card elevation (`scale: 1.02`), outer glow gradient, and quick EXIF technical strip.
- **Photo Lightbox Modal**:
  - `AnimatePresence` layout transitions with background blur fade-in.
  - **Split View Layout**: High-resolution photograph on the left/center with keyboard navigation (Escape, Left/Right arrow keys); Glassmorphic technical spec drawer on the right displaying railway details alongside camera EXIF metrics.

---

## 🔍 3. Automatic Client-Side EXIF Extraction System (`exifr`)

The admin upload interface automatically extracts metadata from uploaded image files:
1. When dropping or selecting an image file in the dropzone, the image buffer is parsed client-side using `exifr.parse(file, { tiff: true, exif: true, gps: true, reviveValues: true })`.
2. Automatically extracts and maps:
   - **Camera Model**: Combined Make & Model (e.g. `Sony ILCE-7M4`, `Nikon D750`, `Canon EOS R6`).
   - **Lens Model**: Auto-detected lens name (e.g. `FE 70-200mm F2.8 GM OSS II`).
   - **Focal Length**: Formatted as e.g. `105mm` (or 35mm equivalent).
   - **Aperture**: Formatted as e.g. `f/4.0` or `f/2.8`.
   - **Shutter Speed**: Converted to fractional shutter speeds e.g. `1/1000s` or whole seconds.
   - **ISO Sensitivity**: Formatted as `ISO 200`.
   - **Date Taken**: Extracted from `DateTimeOriginal` and pre-filled into the datetime picker.
3. Fires toast notification: *"EXIF metadata extracted successfully"*.
4. Admin can inspect, customize, or override any field prior to saving.

---

## 📂 4. Core Pages & Routes

| Route | Role | Description |
| :--- | :--- | :--- |
| `/` | Public Portfolio | Hero documentary banner, prompt-style filter bar, responsive bento grid, split-view Lightbox modal, and Gear & Journey section. |
| `/admin/login` | Curator Auth | Secure login form for site owner (`railway2024!`), protected route middleware, and HTTPOnly session cookies. |
| `/admin` | Curator Studio | Tabbed dashboard with drag-and-drop EXIF upload form and gallery catalog management table (thumbnails, badges, edit modal, delete confirmation modal). |
| `/api/auth` | API | Session creation (`POST`), status check (`GET`), and session destruction (`DELETE`). |
| `/api/photos` | API | List photos with search & filters (`GET`), create new photo (`POST`). |
| `/api/photos/[id]` | API | Get (`GET`), update (`PUT`), and delete (`DELETE`) photo records. |
| `/api/upload` | API | File upload handler saving to storage with server-side EXIF inspection fallback. |

---

## 🗄️ 5. Database Schema & Architecture

### Prisma Schema (`prisma/schema.prisma`):

```prisma
model Photo {
  id           String   @id @default(uuid())
  title        String
  description  String?
  imageUrl     String
  thumbnailUrl String?
  locomotive   String   // CC 201, CC 203, CC 206, Vintage
  trainName    String?  // Argo Bromo Anggrek, Taksaka, etc.
  location     String   // Jembatan Sakalibel, Bumiayu
  region       String?  // Daop 5 Purwokerto
  dateTaken    DateTime
  tags         String[] // Category tags
  cameraModel  String?  // Sony ILCE-7M4
  lens         String?  // FE 70-200mm F2.8 GM OSS II
  focalLength  String?  // 105mm
  aperture     String?  // f/4.0
  shutterSpeed String?  // 1/800s
  iso          String?  // ISO 250
  isFeatured   Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([locomotive])
  @@index([location])
  @@index([dateTaken])
}
```

*Note: For out-of-the-box local running and previewing, the application includes a persistent JSON file-backed repository (`src/lib/db.ts`) with realistic masterworks pre-seeded. When connecting to Supabase or PostgreSQL, provide `DATABASE_URL` in `.env.local` and run `npx prisma db push`.*

---

## 🚀 6. Setup & Deployment Guide

### Local Development

1. Clone or navigate to the repository directory:
   ```bash
   cd "Portfolio Websites Bima"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(Default test login: passkey `railway2024!`)*

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the public portfolio, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the Curator Studio.

5. Validate production build:
   ```bash
   npm run build
   ```

---

## ☁️ 7. Vercel Deployment & Environment Variables

1. Push your repository to GitHub or GitLab.
2. Import the project into **Vercel** (`https://vercel.com/new`).
3. In the **Environment Variables** settings, configure:
   - `ADMIN_PASSWORD`: Your secret administrator passkey (e.g. `your_custom_passkey`).
   - `ADMIN_EMAIL`: Curator email address.
   - `SESSION_SECRET`: Random 32+ character string for token hashing.
   - `DATABASE_URL` *(Optional)*: Supabase / PostgreSQL connection string (`postgresql://postgres:...@...supabase.co:5432/postgres`).
   - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` *(Optional if using Supabase Storage)*.
4. Deploy! Vercel will automatically build the Next.js App Router application with edge route optimization.

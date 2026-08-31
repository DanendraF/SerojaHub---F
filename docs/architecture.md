# Architecture — Seroja Knowledge Hub

> **Status:** 🟡 In Progress — Last updated: 2026-08-31

---

## Stack Teknologi

| Layer | Teknologi | Alasan |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | SSR + Static, satu repo full-stack |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI, accessible components |
| **API Layer** | Next.js Route Handlers (`app/api/`) | Tidak perlu Express terpisah — lebih sederhana & terintegrasi |
| **ORM** | Prisma | Type-safe DB access, auto-migration, schema-first |
| **Database** | Supabase (PostgreSQL) | Cloud PostgreSQL gratis, realtime built-in |
| **File Storage** | Supabase Storage | Foto tanaman upload ke bucket |
| **Auth** | Custom session + localStorage | Admin login berbasis password sederhana |
| **QR Code** | qrcode.react | Generate QR di client, link ke /tanaman/[id] |
| **Deployment** | Netlify (frontend) + Supabase cloud (DB) | Sudah ada netlify.toml |

> **Catatan:** Express.js **tidak diperlukan** karena Next.js App Router sudah punya API Route Handlers yang ekuivalen dan lebih terintegrasi. Prisma dipanggil langsung dari sini ke Supabase PostgreSQL.

---

## Diagram Arsitektur

```
CLIENT (Browser)
  Public Pages: / /tanaman /tanaman/[id] /kebun
  Admin Panel:  /beranda /data-tanaman /tambah-tanaman /edit-tanaman/[id] /qr/[id]
        |
        | fetch / form submit
        v
NEXT.JS APP ROUTER (Netlify)
  Server Components + API Route Handlers
  app/api/
    plants/route.ts         (GET all, POST new)
    plants/[id]/route.ts    (GET, PUT, DELETE)
    kebun/route.ts          (GET, PUT profile)
    upload/route.ts         (POST photo upload)
  |
  | Prisma Client
  v
SUPABASE (Cloud)
  PostgreSQL Database
    Table: Plant
    Table: GardenProfile
    Table: ActivityLog
  Supabase Storage
    Bucket: plant-photos/
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Plant {
  id                     String      @id @default(cuid())
  name                   String
  type                   String
  lokasi_bedeng          String?
  planting_date          DateTime
  estimated_harvest_date DateTime
  photo_url              String?
  description            String?
  cara_tanam             String?
  manfaat                String?
  catatan_pengelola      String?
  status                 PlantStatus @default(TUMBUH)
  created_at             DateTime    @default(now())
  updated_at             DateTime    @updatedAt
}

model GardenProfile {
  id          String    @id @default(cuid())
  nama        String
  deskripsi   String?
  lokasi      String?
  luas_area   String?
  founded_at  DateTime?
  foto_url    String?
  updated_at  DateTime  @updatedAt
}

model ActivityLog {
  id         String   @id @default(cuid())
  aksi       String
  deskripsi  String?
  created_at DateTime @default(now())
}

enum PlantStatus {
  TUMBUH
  SIAP_PANEN
  PANEN
  SELESAI
}
```

---

## Target Folder Structure

```
SerojaHub/
├── app/
│   ├── api/
│   │   ├── plants/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── kebun/route.ts
│   │   └── upload/route.ts
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── tanaman/
│   │   └── kebun/
│   ├── (admin)/
│   │   ├── beranda/
│   │   ├── data-tanaman/
│   │   ├── tambah-tanaman/
│   │   ├── edit-tanaman/[id]/
│   │   └── qr/[id]/
│   └── layout.tsx
├── lib/
│   ├── prisma.ts        ← Singleton Prisma client
│   ├── supabase.ts      ← Supabase client (storage)
│   └── ...
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── docs/
    ├── architecture.md  (file ini)
    ├── sistem.md
    └── perencanaan.md
```

---

## Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[anon-key]"
SUPABASE_SERVICE_ROLE_KEY="[service-role-key]"
```

---

## Data Flow — CRUD Tanaman

```
Admin isi form → POST /api/plants
  → prisma.plant.create()
  → Supabase PostgreSQL INSERT
  → Response JSON → redirect /qr/[id]
```

## Data Flow — Scan QR Publik

```
Warga scan QR → GET /tanaman/[id]
  → fetch /api/plants/[id]
  → prisma.plant.findUnique()
  → Supabase SELECT
  → Halaman detail tanaman
```

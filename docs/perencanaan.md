# Perencanaan — Seroja Knowledge Hub

> **Dokumen ini adalah roadmap pengerjaan yang akan diupdate setiap sprint/sesi.**
> **Status:** 🟡 In Progress — Last updated: 2026-08-31

---

## Fase 0 — Fondasi UI (✅ Selesai)

| # | Tugas | Status |
|---|---|---|
| 0.1 | Setup proyek Next.js + Tailwind + shadcn/ui | ✅ |
| 0.2 | Landing page + hero section dengan foto kebun | ✅ |
| 0.3 | Navbar transparan + scroll transition | ✅ |
| 0.4 | Logo Kebun Seroja di semua halaman & favicon | ✅ |
| 0.5 | Login popup dialog di navbar | ✅ |
| 0.6 | Slider foto otomatis di hero section | ✅ |
| 0.7 | Panel admin (beranda, data tanaman, tambah, edit, QR) | ✅ |
| 0.8 | Halaman publik daftar & detail tanaman | ✅ |
| 0.9 | Generate & download QR code | ✅ |

---

## Fase 1 — Setup Backend & Database (🔴 Belum Dimulai)

**Target:** Data tanaman tersimpan permanen di Supabase, tidak hilang saat refresh.

| # | Tugas | File | Status |
|---|---|---|---|
| 1.1 | Install Prisma + setup prisma/schema.prisma | prisma/schema.prisma | 🔴 |
| 1.2 | Buat akun & project Supabase, ambil connection string | .env.local | 🔴 |
| 1.3 | Konfigurasi lib/prisma.ts (singleton client) | lib/prisma.ts | 🔴 |
| 1.4 | Konfigurasi lib/supabase.ts (storage client) | lib/supabase.ts | 🔴 |
| 1.5 | Jalankan prisma migrate dev → buat tabel di Supabase | — | 🔴 |
| 1.6 | Buat seed data tanaman awal (prisma/seed.ts) | prisma/seed.ts | 🔴 |
| 1.7 | Buat API Route: GET /api/plants | pp/api/plants/route.ts | 🔴 |
| 1.8 | Buat API Route: POST /api/plants | pp/api/plants/route.ts | 🔴 |
| 1.9 | Buat API Route: GET/PUT/DELETE /api/plants/[id] | pp/api/plants/[id]/route.ts | 🔴 |
| 1.10 | Buat API Route: POST /api/upload (foto ke Supabase Storage) | pp/api/upload/route.ts | 🔴 |
| 1.11 | Update plant-context.tsx → fetch dari API, bukan mock data | lib/plant-context.tsx | 🔴 |
| 1.12 | Update form tambah/edit tanaman → POST ke API | components/plant-form.tsx | 🔴 |

---

## Fase 2 — Perkaya Data & Field Tanaman (🔴 Belum Dimulai)

| # | Tugas | File | Status |
|---|---|---|---|
| 2.1 | Tambah field: lokasi_bedeng, cara_tanam, catatan_pengelola, status | prisma/schema.prisma | 🔴 |
| 2.2 | Update form tambah/edit dengan field baru | components/plant-form.tsx | 🔴 |
| 2.3 | Update halaman detail publik tampilkan field baru | pp/tanaman/[id]/page.tsx | 🔴 |
| 2.4 | Update tipe TypeScript (lib/types.ts) sinkron dengan Prisma | lib/types.ts | 🔴 |
| 2.5 | Isi seed data 10+ tanaman kebun komunitas (kangkung, jahe, kunyit, pandan, dll.) | prisma/seed.ts | 🔴 |

---

## Fase 3 — Halaman Publik yang Lebih Kaya (🔴 Belum Dimulai)

| # | Tugas | File | Status |
|---|---|---|---|
| 3.1 | Redesign halaman detail tanaman publik (/tanaman/[id]) — lebih hangat, info lengkap | pp/tanaman/[id]/page.tsx | 🔴 |
| 3.2 | Tambah filter jenis + search di /tanaman | pp/tanaman/page.tsx | 🔴 |
| 3.3 | Buat halaman Profil Kebun (/kebun) | pp/kebun/page.tsx | 🔴 |
| 3.4 | Buat API Route profil kebun (/api/kebun) | pp/api/kebun/route.ts | 🔴 |
| 3.5 | Tambah menu "Profil Kebun" di navbar publik | components/site-header.tsx | 🔴 |

---

## Fase 4 — Perbaikan QR Code & Label Cetak (🔴 Belum Dimulai)

| # | Tugas | File | Status |
|---|---|---|---|
| 4.1 | Redesign label QR: tampilkan logo, nama, lokasi bedeng, URL | pp/qr/[id]/page.tsx | 🔴 |
| 4.2 | Tambah opsi ukuran cetak (9x9cm, A6, A5) | pp/qr/[id]/page.tsx | 🔴 |
| 4.3 | Tambah print CSS yang bersih untuk label QR | pp/globals.css | 🔴 |

---

## Fase 5 — Upload Foto & Storage (🔴 Belum Dimulai)

| # | Tugas | File | Status |
|---|---|---|---|
| 5.1 | Buat Supabase Storage bucket plant-photos | Supabase Dashboard | 🔴 |
| 5.2 | Komponen upload foto di form tanaman | components/plant-form.tsx | 🔴 |
| 5.3 | API upload foto → simpan ke Supabase Storage → simpan URL ke DB | pp/api/upload/route.ts | 🔴 |

---

## Fase 6 — Polish & Deploy (🔴 Belum Dimulai)

| # | Tugas | Status |
|---|---|---|
| 6.1 | Responsif semua halaman (mobile + tablet + desktop) | 🔴 |
| 6.2 | Loading state & error handling di semua page | 🔴 |
| 6.3 | Set environment variables di Netlify dashboard | 🔴 |
| 6.4 | Deploy final ke Netlify | 🔴 |
| 6.5 | Test scan QR code di kondisi nyata (HP di kebun) | 🔴 |

---

## Prioritas Pengerjaan Selanjutnya

> **Sesi berikutnya dimulai dari Fase 1.**

### Langkah awal yang perlu disiapkan sebelum coding:
1. **Buat project Supabase baru** di https://supabase.com → ambil DATABASE_URL dan SUPABASE_URL
2. **Buat file .env.local** di root project, isi dengan connection string dari Supabase
3. Lalu lanjut install Prisma dan generate schema

---

## Changelog

| Tanggal | Sesi | Perubahan |
|---|---|---|
| 2026-08-26 | 1 | Setup UI awal, navbar, landing page |
| 2026-08-28 | 2 | Logo integrasi, QR system, login popup dialog |
| 2026-08-31 | 3 | Perencanaan backend Prisma + Supabase, buat docs/ |

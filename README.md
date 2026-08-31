# Seroja Knowledge Hub — Frontend

Aplikasi frontend untuk Kebun Komunitas Seroja. Dibangun menggunakan Next.js (App Router), Tailwind CSS, dan shadcn/ui.

## Fitur Utama

- **Halaman Publik**:
  - Daftar Tanaman dengan filter cepat (Semua, Buah, Sayur).
  - Pencarian interaktif.
  - Detail Tanaman yang informatif (Deskripsi, Manfaat Kesehatan, Cara Tanam, Estimasi Panen, Lokasi Bedeng).
  - Tampilan QR Code untuk setiap tanaman.

- **Panel Pengelola (Admin)**:
  - Dashboard ringkasan (Total tanaman, siap panen, status tumbuh).
  - Manajemen Data Tanaman (CRUD).
  - Unggah foto tanaman ke Supabase Storage.
  - Cetak / Unduh QR Code tanaman untuk dipasang di kebun.
  - Login pengelola aman dengan enkripsi password (bcrypt).

## Teknologi

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui & Radix UI
- **Icons**: Lucide React
- **QR Code**: qrcode.react

## Persiapan & Jalankan

1. **Salin Environment Variable**:
   ```bash
   cp .env.example .env.local
   ```
   Isi `NEXT_PUBLIC_API_URL` dengan alamat API backend Anda (contoh: `http://localhost:5000/api` untuk lokal).

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

## Build untuk Production

```bash
npm run build
npm run start
```

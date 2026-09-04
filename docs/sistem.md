# Sistem - Seroja Knowledge Hub

> **Dokumen ini mendeskripsikan semua modul, halaman, dan fungsionalitas sistem.**
> **Status:** 🟡 In Progress - Last updated: 2026-08-31

---

## Ringkasan Sistem

**Seroja Knowledge Hub** adalah sistem informasi berbasis web untuk **Kebun Komunitas Seroja**. Sistem ini melayani dua jenis pengguna:

| Pengguna | Akses | Tujuan |
|---|---|---|
| **Warga / Pengunjung Kebun** | Publik (tanpa login) | Scan QR code di tanaman, lihat info tanaman, profil kebun |
| **Pengelola Kebun** | Admin (login diperlukan) | CRUD data tanaman, cetak QR code, kelola profil kebun |

---

## Modul & Halaman

### 🌿 Area Publik (Tanpa Login)

#### 1. Landing Page (/)
- Hero section dengan foto kebun + slider galeri
- Ringkasan fitur sistem
- Tentang kebun (singkat)
- Tombol "Masuk" membuka popup login dialog
- **Status:** ✅ Selesai

#### 2. Daftar Tanaman (/tanaman)
- Grid semua tanaman yang terdaftar
- Filter berdasarkan jenis (Sayur, Buah, Herbal, dll.)
- Search / pencarian nama tanaman
- Badge status: Tumbuh / Siap Panen
- Setiap kartu klik → detail tanaman
- **Status:** 🟡 Perlu update (tambah filter, data dari DB)

#### 3. Detail Tanaman (/tanaman/[id])
- Halaman ini yang dibuka saat warga **scan QR code** di kebun fisik
- Foto besar tanaman
- Nama, jenis, lokasi bedeng di kebun
- Status tanaman saat ini
- Tanggal tanam & perkiraan panen
- Deskripsi, cara tanam, manfaat
- Catatan pengelola
- QR code mini (bisa scan ulang / share)
- Tombol "Lihat Tanaman Lain"
- **Status:** 🟡 Perlu redesign & data dari DB

#### 4. Profil Kebun (/kebun)
- Nama, deskripsi, lokasi kebun
- Galeri foto kebun
- Statistik: jumlah tanaman, luas area, dll.
- Visi misi / tujuan kebun komunitas
- Timeline aktivitas terbaru
- **Status:** 🔴 Belum dibuat

---

### ⚙️ Area Admin (Login Diperlukan)

#### 5. Login (popup modal)
- Dialog popup di navbar (bukan halaman terpisah)
- Input username + password
- Redirect ke /beranda setelah berhasil
- **Status:** ✅ Selesai

#### 6. Dashboard / Beranda Admin (/beranda)
- Statistik ringkas: total tanaman, siap panen, tumbuh, lewat panen
- Tabel jadwal panen
- Kartu tanaman terbaru
- Quick actions: Tambah, Data, Halaman Publik
- **Status:** ✅ Selesai (perlu update data dari DB)

#### 7. Data Tanaman (/data-tanaman)
- Tabel/list semua tanaman dengan search
- Tombol: Edit, QR, Hapus
- Badge status tiap tanaman
- **Status:** ✅ Selesai (perlu update data dari DB)

#### 8. Tambah Tanaman (/tambah-tanaman)
- Form: nama, jenis, lokasi bedeng, tanggal tanam, perkiraan panen
- Upload foto tanaman → Supabase Storage
- Field tambahan: cara tanam, manfaat, deskripsi, catatan
- Setelah submit → redirect ke halaman QR
- **Status:** 🟡 Perlu update form & koneksi DB

#### 9. Edit Tanaman (/edit-tanaman/[id])
- Form yang sama dengan tambah, pre-filled data tanaman
- **Status:** 🟡 Perlu update koneksi DB

#### 10. Halaman QR Code (/qr/[id])
- Tampilkan QR code tanaman
- Download PNG
- Cetak (print layout)
- Label QR yang rapi: nama, jenis, lokasi, URL
- **Status:** 🟡 Perlu perbaikan desain label cetak

---

## Model Data

### Plant (Tanaman)
| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Nama tanaman |
| type | String | Jenis (Sayur Daun, Sayur Buah, Herbal, dll.) |
| lokasi_bedeng | String? | Lokasi di kebun (Bedeng A, Pot Utara, dll.) |
| planting_date | DateTime | Tanggal tanam |
| estimated_harvest_date | DateTime | Perkiraan panen |
| photo_url | String? | URL foto (Supabase Storage) |
| description | String? | Deskripsi umum |
| cara_tanam | String? | Cara menanam / merawat |
| manfaat | String? | Manfaat tanaman |
| catatan_pengelola | String? | Catatan dari pengelola |
| status | Enum | TUMBUH / SIAP_PANEN / PANEN / SELESAI |
| created_at | DateTime | Waktu dibuat |
| updated_at | DateTime | Waktu diperbarui |

### GardenProfile (Profil Kebun)
| Field | Tipe | Keterangan |
|---|---|---|
| id | String | Primary key |
| nama | String | Nama resmi kebun |
| deskripsi | String? | Deskripsi kebun |
| lokasi | String? | Alamat / lokasi |
| luas_area | String? | Luas area kebun |
| founded_at | DateTime? | Tahun berdiri |
| foto_url | String? | Foto utama kebun |

---

## API Endpoints (Next.js Route Handlers)

| Method | Path | Fungsi |
|---|---|---|
| GET | /api/plants | Ambil semua tanaman |
| POST | /api/plants | Tambah tanaman baru |
| GET | /api/plants/:id | Detail satu tanaman |
| PUT | /api/plants/:id | Update tanaman |
| DELETE | /api/plants/:id | Hapus tanaman |
| GET | /api/kebun | Ambil profil kebun |
| PUT | /api/kebun | Update profil kebun |
| POST | /api/upload | Upload foto ke Supabase Storage |

---

## QR Code System

### Alur Lengkap
```
1. Pengelola tambah tanaman → sistem buat ID unik (cuid)
2. Pengelola buka /qr/[id] → QR code di-generate otomatis
3. QR code berisi URL: https://[domain]/tanaman/[id]
4. Pengelola unduh PNG atau cetak label QR
5. Label QR ditempel di papan/pot/batang tanaman di kebun fisik
6. Warga kebun scan QR dengan kamera HP
7. Browser membuka /tanaman/[id] → info lengkap tanaman
```

### Format Label QR Cetak
- Logo Kebun Seroja
- QR code (200x200px)
- Nama tanaman (besar)
- Jenis tanaman
- Lokasi bedeng
- URL (kecil, sebagai fallback)
- Ukuran label: 9x9cm (bisa cetak di kertas A4, laminasi, tempel di kebun)

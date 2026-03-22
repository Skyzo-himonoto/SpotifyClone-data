# 🎵 Spotify Clone React - Full Stack

Project ini clone platform musik Spotify yang dibangun menggunakan ekosistem modern web development. Fokus utama project ini adalah performa pemutaran musik yang lancar dan sinkronisasi data database.


## 🛠️ Persyaratan Sistem (Manual Setup)

Karena project ini menggunakan **React** dengan **Vite**, pastikan lu udah siapin bahan-bahan di bawah ini di lingkungan kerja lu (Replit/Local):

### 1. Struktur Folder Utama
Susun folder lu persis kayak gini biar kodingannya gak "bentrok":
- `client/src/components` -> Untuk komponen tampilan (Player, Card, Sidebar).
- `client/src/components/ui` -> Untuk elemen kecil (Slider, Button, Toast).
- `client/src/hooks` -> Untuk logika state musik (use-store).
- `client/src/lib` -> Untuk konfigurasi database & alat bantu (Supabase, Utils).
- `client/src/pages` -> Untuk halaman utama (Home, Search, Library).

### 2. File Konfigurasi Database (.env)
Aplikasi ini butuh koneksi ke Supabase. Buat file `.env` di folder paling luar dan isi kuncinya sendiri:
```text
VITE_SUPABASE_URL=MASUKKAN_URL_SUPABASE_LU
VITE_SUPABASE_ANON_KEY=MASUKKAN_ANON_KEY_LU

 Daftar Library yang Digunakan
​Kalo lu install manual di terminal/shell, lu harus jalanin perintah ini biar fiturnya gak error:
npm install lucide-react howler wouter @tanstack/react-query @supabase/supabase-js

🚀 Panduan Penggunaan
​Salin Kode Utama: Salin isi file App.tsx, Player.tsx, dan SongCard.tsx ke folder masing-masing.
​Setup Musik: Pastiin file use-store.ts sudah terpasang di folder hooks agar tombol Play bisa berfungsi.
​Running: Gunakan perintah npm run dev untuk menjalankan aplikasi.
​Mobile Layout: Jika slider progress di HP tertutup navigasi bawah, cari file Player.tsx dan tambahkan padding-bottom (pb-24) pada container Full-Screen Player.
​📝 Catatan Penting
​Project ini menggunakan TypeScript (.tsx / .ts) untuk keamanan kode/aman dari suspen github.
​Pastikan font Figtree atau Circular Std sudah terdaftar di index.html agar tampilan navigasi dan teks terlihat mirip dengan aslinya.
​Semua data lagu ditarik melalui integrasi API yang sudah dikonfigurasi di dalam kodingan.

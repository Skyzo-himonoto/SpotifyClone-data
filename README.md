# 🎵 Spotify Clone React - Full Stack

Project ini clone platform musik Spotify yang dibangun menggunakan ekosistem modern web development. Fokus utama project ini adalah performa pemutaran musik yang lancar dan sinkronisasi data database. 

> **Catatan:** Cari tahu terlebih dahulu di AI karena files ini belum 100% mempunyai database/fitur yang lengkap bisa ke email saya : skyzoc1a@gmail.com atau wa : 088225879928

## 🛠️ Persyaratan Sistem (Manual Setup)

Karena project ini menggunakan **React** dengan **Vite**, pastikan lu udah siapin bahan-bahan di bawah ini di lingkungan kerja lu (Replit/Local):

### 1. Struktur Folder Utama
Susun folder lu persis kayak gini biar kodingannya gak "bentrok":
- `client/src/components` -> Komponen tampilan (Player, Card, Sidebar).
- `client/src/components/ui` -> Elemen kecil (Slider, Button, Toast).
- `client/src/hooks` -> Logika state musik (use-store).
- `client/src/lib` -> Konfigurasi database & alat bantu (Supabase, Utils).
- `client/src/pages` -> Halaman utama (Home, Search, Library).

### 2. File Konfigurasi Database (.env)
Aplikasi ini butuh koneksi ke Supabase. Buat file `.env` di folder paling luar dan isi kuncinya sendiri:
```text
VITE_SUPABASE_URL=MASUKKAN_URL_SUPABASE_LU
VITE_SUPABASE_ANON_KEY=MASUKKAN_ANON_KEY_LU

📦 Daftar Library yang Digunakan
​Kalo lu install manual di terminal/shell, lu harus jalanin perintah ini biar fiturnya gak error:
npm install lucide-react howler wouter @tanstack/react-query @supabase/supabase-js

🚀 Panduan Penggunaan
​Salin Kode Utama: Salin isi file App.tsx, Player.tsx, dan SongCard.tsx ke folder masing-masing.
​Setup Musik: Pastiin file use-store.ts sudah terpasang di folder hooks agar tombol Play bisa berfungsi.
​Running: Gunakan perintah npm run dev untuk menjalankan aplikasi.
​Mobile Layout: Jika slider progress di HP tertutup navigasi bawah, cari file Player.tsx dan tambahkan padding-bottom (pb-24) pada container Full-Screen Player.
​📝 Catatan Penting
​Project ini menggunakan TypeScript (.tsx / .ts) untuk keamanan kode dan lebih aman dari suspend GitHub.
​Pastikan font Figtree atau Circular Std sudah terdaftar di index.html agar tampilan navigasi dan teks terlihat mirip dengan aslinya.
​Semua data lagu ditarik melalui integrasi API yang sudah dikonfigurasi di dalam kodingan.

🛠️ Issues (Laporan Kendala & Struktur Folder)

📁 Daftar Folder & File Utama (kalo eror lapor gan)
Pastiin folder lu isinya lengkap kayak gini:

1. `client/src/components/`
   - Isinya: `Player.tsx` (Pemutar musik), `SongCard.tsx` (Kartu lagu), `Sidebar.tsx`.
2. `client/src/components/ui/`
   - Isinya: `slider.tsx` (Bar durasi), `toast.tsx` (Notifikasi), `button.tsx`.
3. `client/src/hooks/`
   - Isinya: `use-store.ts` (Ini otaknya! Tanpa ini lagu nggak bakal muter).
4. `client/src/lib/`
   - Isinya: `supabase.ts` (Koneksi database), `uuid-utils.ts` (ID unik buat Like).
5. `client/src/pages/`
   - Isinya: `Home.tsx`, `Search.tsx`, `Library.tsx`.

📝 Cara Lapor Bug / Folder Ilang
Kalau ada yang nggak sesuai sama daftar di atas, lapor pake format ini:

1. **Judul**: [BUG] Nama Error / Folder yang Ilang
2. **Deskripsi**: Jelasin kenapa bisa error (Contoh: "Bang, folder hooks gue kok nggak ada file use-store-nya?").
3. **Screenshot**: Lampirin foto error-nya. 
   - **Caranya**: Cukup **Copy-Paste** gambar atau **Drag & Drop** foto lu langsung ke kotak pesan GitHub ini. Gak perlu ribet pake link!

Masalah Umum (FAQ):
- **Folder Kosong**: Kalo folder `hooks`, `lib`, atau `pages` nggak muncul di GitHub, itu karena isinya belum di-upload (Git nggak suka folder kosong). Cek lagi file `.tsx` atau `.ts` lu.
- **Slider Kepotong**: Itu masalah layout mobile. Langsung cek bagian `Mobile Layout` di atas buat cara benerinnya.

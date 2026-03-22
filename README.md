# 🎵 Spotify Clone React - Full Stack

Project ini clone platform musik Spotify yang dibangun menggunakan ekosistem modern web development. Fokus utama project ini adalah performa pemutaran musik yang lancar dan sinkronisasi data database. 

> **Catatan:** Cari tahu terlebih dahulu di AI karena files ini belum 100% mempunyai database/fitur yang lengkap bisa ke email saya : skyzoc1a@gmail.com atau wa : 088225879928

​🚀 STEP 1: PERSIAPAN LINGKUNGAN (PILIH SALAH SATU)
​A. Untuk Pengguna Laptop/PC (VS Code/Terminal)
​Jalankan perintah ini berurutan:

```text
npm create vite@latest spotify-clone -- --template react-ts
cd spotify-clone
npm install
npm install lucide-react howler wouter @tanstack/react-query @supabase/supabase-js
```

B. Untuk Pengguna HP (Termux)
​Khusus Termux, lu harus install Node.js dulu:
```text
pkg update && pkg upgrade
pkg install nodejs
npx create-vite spotify-clone --template react-ts
cd spotify-clone
npm install
npm install lucide-react howler wouter @tanstack/react-query @supabase/supabase-js
```

Note Termux: Jika error saat install, gunakan termux-chroot sebelum running.

STEP 2: GENERATE CODE VIA AI (Pilih AI Favorit Lu)
​Lu bisa pake Gemini, ChatGPT, Claude, DeepSeek, atau Grok. pake prompt yang gw siapin di bawah biar kodingannya gak hallucinate: satu satu bang ntar eror
```text
​1. Setup Database & Hooks (Logic Pertama)
​"Buatkan file supabase.ts di folder lib untuk koneksi Supabase menggunakan environment variables. Lalu buatkan use-store.ts di folder hooks menggunakan library Howler.js untuk handle state global pemutar musik (Play, Pause, Volume, Next)."
​2. Setup UI & Components (Tampilan)
​"Buatkan komponen React Player.tsx (dengan progress bar), SongCard.tsx (dengan hover play), dan Sidebar.tsx (responsif). Gunakan Tailwind CSS dan Lucide Icons. Pastikan layout support Mobile & Desktop."
​3. Setup Halaman (Pages)
​"Buatkan halaman Home.tsx (untuk list lagu), Search.tsx (input pencarian), dan Library.tsx (daftar lagu favorit). Hubungkan semuanya di App.tsx menggunakan wouter."
```
​📂 STEP 3: STRUKTUR FILES (WAJIB SESUAI!)
​Pindahkan hasil kodingan dari AI tadi ke folder masing-masing:

​📁 client/src/components/ -> Player.tsx, SongCard.tsx, Sidebar.tsx.

​📁 client/src/components/ui/ -> slider.tsx, toast.tsx, button.tsx.

​📁 client/src/hooks/ -> use-store.ts (Otak Musik).

​📁 client/src/lib/ -> supabase.ts, uuid-utils.ts.

​📁 client/src/pages/ -> Home.tsx, Search.tsx, Library.tsx.

​⚙️ STEP 4: KONFIGURASI DATABASE (.env)
​Buat file .env di folder root (luar) dan isi dengan data dari Dashboard Supabase lu:
```text
VITE_SUPABASE_URL=URL_SUPABASE_LU
VITE_SUPABASE_ANON_KEY=ANON_KEY_LU
```
🛠️ STEP 5: OPTIMASI & FIX (Ga baca bisulan)

Fix Mobile Layout: kalau slider progress di HP tertutup navigasi bawah, buka Player.tsx dan tambahkan padding-bottom 
(pb-24) pada container Full-Screen Player.

Font Premium: Pastikan font Figtree atau Circular Std sudah terdaftar di index.html agar UI mirip aslinya.

TypeScript Safety: Project ini menggunakan format .tsx agar lebih aman dari suspend GitHub dan deteksi error lebih cepat

​📝 CARA LAPOR BUG (ISSUES)
​Jika ada file yang hilang atau kodingan dari AI ada yang error, lapor ke GitHub dengan cara:
​Buka tab Issues.
​Masukkan judul: [BUG] Nama Error.
​Screenshot: Cukup Copy-Paste atau Drag & Drop foto error lu langsung ke kotak pesan GitHub. Gue (AI) bakal bantu analisa lewat gambar tersebut!

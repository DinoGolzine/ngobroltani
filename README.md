# NgobrolTani 🌱

Forum tanya jawab perawatan tanaman ala StackOverflow.
**Stack:** SvelteKit (Svelte 5) · Supabase (Auth, Database, Storage) · Vercel.

## Fitur
- Daftar dan masuk dengan email + password (Supabase Auth)
- 5 forum tematik, masing-masing dengan **panduan lengkap** + ruang tanya jawab
- Posting pertanyaan: judul, deskripsi, foto (opsional, maks 5 MB)
- Jawab pertanyaan, tandai **jawaban terbaik** (oleh penanya)
- Hapus pertanyaan dan jawaban milik sendiri (foto ikut terhapus)
- Pencarian, urutkan (terbaru / paling ramai / belum terjawab), statistik komunitas, galeri foto

## 1. Siapkan Supabase
1. Buat project baru di <https://supabase.com>.
2. Buka **SQL Editor**, tempel seluruh isi `supabase/schema.sql`, lalu **Run**.
   Ini membuat tabel, aturan keamanan (RLS), dan bucket storage `question-images`.
3. Buka **Authentication > Providers > Email**. Untuk uji coba cepat, matikan **Confirm email**
   (kalau dibiarkan aktif, pengguna harus klik link di email dulu sebelum bisa masuk).
4. Buka **Project Settings > API**, salin **Project URL** dan **anon public key**.

## 2. Coba di komputer (opsional)
```bash
npm install
cp .env.example .env     # isi PUBLIC_SUPABASE_URL dan PUBLIC_SUPABASE_ANON_KEY
npm run dev
```
Buka <http://localhost:5173>.

## 3. Deploy ke Vercel
> Vercel tidak menerima upload file zip langsung lewat dashboard. Gunakan salah satu cara berikut.

### Cara A: lewat GitHub (disarankan)
1. Ekstrak zip ini, lalu buat repository baru di GitHub dan push isinya:
   ```bash
   git init && git add . && git commit -m "NgobrolTani"
   git branch -M main
   git remote add origin https://github.com/USERNAME/ngobroltani.git
   git push -u origin main
   ```
2. Di <https://vercel.com/new>, pilih repository tersebut (Framework terdeteksi otomatis: **SvelteKit**).
3. Pada **Environment Variables**, tambahkan:
   | Nama | Nilai |
   |---|---|
   | `PUBLIC_SUPABASE_URL` | Project URL Supabase |
   | `PUBLIC_SUPABASE_ANON_KEY` | anon public key |
4. Klik **Deploy**.

### Cara B: Vercel CLI (tanpa GitHub)
```bash
npm i -g vercel
vercel            # ikuti pertanyaan, lalu tambahkan env di dashboard atau:
vercel env add PUBLIC_SUPABASE_URL
vercel env add PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

## 4. Setelah deploy
Di Supabase, buka **Authentication > URL Configuration**, isi **Site URL** dengan alamat Vercel kamu
(misal `https://ngobroltani.vercel.app`). Ini penting agar link konfirmasi email mengarah ke situs yang benar.

## Struktur proyek
```
supabase/schema.sql          skema DB, RLS, storage
src/lib/forums.js            isi panduan tiap forum (ubah teks di sini)
src/lib/supabase.js          klien Supabase
src/routes/+page.svelte      beranda / dashboard
src/routes/forum/[slug]      halaman forum (panduan + diskusi)
src/routes/pertanyaan/[id]   detail pertanyaan + jawaban
src/routes/tanya             form pertanyaan + upload foto
src/routes/masuk             login dan daftar
```

## Catatan
- Foto banner memakai gambar dari Unsplash. Jika gagal dimuat, otomatis diganti latar gradien hijau.
  Ganti URL di `src/lib/forums.js` bila ingin memakai foto sendiri.
- Kunci `anon` memang aman dipublikasikan; keamanan data dijaga oleh Row Level Security di `schema.sql`.

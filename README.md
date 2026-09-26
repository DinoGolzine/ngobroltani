# Tanya Tanaman

Website tanya jawab seputar perawatan tanaman (mirip StackOverflow versi sederhana).
Pengguna bisa mendaftar/masuk dengan email & password, memposting pertanyaan (judul,
deskripsi, foto opsional), dan menjawab pertanyaan orang lain.

Kategori pertanyaan yang sudah disiapkan:

- Tips Merawat Tanaman
- Cara Memberi Pupuk
- Mengatasi Hama
- Mengatasi Tanaman Layu
- Cara Memilih Bibit

**Teknologi:** SvelteKit (frontend) + Supabase (auth, database, storage) + Vercel (hosting).

---

## 1. Siapkan project Supabase

1. Buka [supabase.com](https://supabase.com) → **New project**. Catat *Database password* yang dibuat.
2. Setelah project siap, buka menu **SQL Editor** → **New query**.
3. Buka file `supabase/schema.sql` di project ini, salin seluruh isinya, tempel ke SQL Editor, lalu klik **Run**.
   - Script ini akan membuat tabel `categories`, `profiles`, `questions`, `answers`,
     mengisi 5 kategori awal, mengaktifkan Row Level Security beserta policy-nya,
     dan membuat storage bucket publik bernama `question-images` untuk foto pertanyaan.
4. Buka menu **Authentication → Providers**, pastikan **Email** aktif (biasanya sudah aktif secara default).
   - Jika ingin pengguna langsung bisa login tanpa verifikasi email saat development,
     matikan opsi **Confirm email** di **Authentication → Settings**. Untuk production,
     sebaiknya biarkan aktif dan atur *Site URL* / *Redirect URLs* sesuai domain Vercel Anda
     di **Authentication → URL Configuration**.
5. Buka menu **Project Settings → API**, catat dua nilai berikut (dipakai di langkah 2):
   - **Project URL**
   - **anon public key**

## 2. Jalankan secara lokal (opsional, untuk uji coba)

1. Ekstrak file zip project ini, lalu buka folder-nya di terminal.
2. Salin `.env.example` menjadi `.env`, lalu isi dengan nilai dari Supabase:

   ```
   PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=isi-dengan-anon-public-key-anda
   ```

3. Install dependencies dan jalankan:

   ```bash
   npm install
   npm run dev
   ```

4. Buka `http://localhost:5173` di browser.

## 3. Deploy ke Vercel

Ada dua cara. Pilih salah satu.

### Cara A — lewat Vercel CLI langsung dari folder zip (paling cepat)

1. Ekstrak zip ini, buka foldernya di terminal.
2. Install Vercel CLI jika belum punya:

   ```bash
   npm install -g vercel
   ```

3. Login lalu deploy:

   ```bash
   vercel login
   vercel
   ```

   Ikuti pertanyaan yang muncul (pilih scope/akun, nama project, dsb). Vercel akan
   otomatis mendeteksi ini sebagai project SvelteKit.

4. Saat pertama kali deploy (atau lewat dashboard Vercel → project Anda → **Settings → Environment Variables**),
   tambahkan dua environment variable berikut untuk environment **Production** (dan **Preview** jika perlu):

   | Name | Value |
   |---|---|
   | `PUBLIC_SUPABASE_URL` | Project URL dari Supabase |
   | `PUBLIC_SUPABASE_ANON_KEY` | anon public key dari Supabase |

5. Deploy ke production:

   ```bash
   vercel --prod
   ```

6. Setelah selesai, buka URL yang diberikan Vercel. Tambahkan URL tersebut ke
   **Authentication → URL Configuration → Site URL / Redirect URLs** di Supabase
   supaya login/verifikasi email berjalan dengan benar.

### Cara B — lewat GitHub + Vercel Dashboard

1. Ekstrak zip ini, lalu push isinya ke repository GitHub baru:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <url-repo-github-anda>
   git push -u origin main
   ```

2. Buka [vercel.com/new](https://vercel.com/new), pilih repository tersebut, klik **Import**.
3. Sebelum klik **Deploy**, buka bagian **Environment Variables** dan isi:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy**. Vercel otomatis mendeteksi framework SvelteKit (adapter-vercel sudah dikonfigurasi di `svelte.config.js`).
5. Setelah selesai, tambahkan URL production Vercel ke pengaturan URL Supabase seperti pada Cara A langkah 6.

---

## Struktur project

```
src/
  app.html            Shell HTML + font
  app.css             Design tokens & style dasar (warna, tipografi)
  lib/
    supabaseClient.js Klien Supabase (pakai env PUBLIC_*)
    stores/auth.js    Svelte store untuk sesi user
    components/
      QuestionCard.svelte
      AnswerCard.svelte
  routes/
    +layout.svelte    Header, navigasi, wiring sesi login
    +page.svelte      Beranda: filter kategori + daftar pertanyaan
    login/+page.svelte
    register/+page.svelte
    questions/new/+page.svelte     Form buat pertanyaan (+ upload foto)
    questions/[id]/+page.svelte    Detail pertanyaan + daftar & form jawaban
supabase/
  schema.sql          Semua SQL: tabel, seed kategori, RLS, storage bucket
```

## Catatan

- Autentikasi, database, dan storage semuanya lewat Supabase — tidak ada backend server terpisah.
- Foto pertanyaan disimpan di storage bucket publik `question-images`, dikelompokkan per folder `user_id`.
- Lihat `progress.md` untuk daftar fitur yang sudah selesai dan yang belum.

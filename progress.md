# Progress

Status: MVP pertama sudah jalan end-to-end (auth, posting pertanyaan + foto, menjawab).

## Sudah dibuat

- [x] Setup project SvelteKit + adapter-vercel + integrasi Supabase client
- [x] Skema database (`supabase/schema.sql`): tabel `categories`, `profiles`, `questions`, `answers`
- [x] 5 kategori awal sudah di-seed: Tips Merawat Tanaman, Cara Memberi Pupuk, Mengatasi Hama,
      Mengatasi Tanaman Layu, Cara Memilih Bibit
- [x] Row Level Security: pertanyaan & jawaban bisa dibaca semua orang, hanya bisa
      ditambahkan oleh user yang login, hanya pemilik yang bisa update/delete miliknya
- [x] Trigger otomatis membuat baris `profiles` saat user baru mendaftar (untuk nama tampilan)
- [x] Storage bucket publik `question-images` + policy upload (harus login) & baca (publik)
- [x] Registrasi & login dengan email/password (Supabase Auth)
- [x] Header dengan status login, tombol masuk/daftar/keluar
- [x] Halaman beranda: filter berdasarkan kategori, daftar pertanyaan terbaru (judul,
      cuplikan deskripsi, jumlah jawaban, thumbnail foto)
- [x] Form buat pertanyaan: judul, deskripsi, pilih kategori, upload foto opsional (preview sebelum kirim)
- [x] Halaman detail pertanyaan: isi lengkap + foto, daftar jawaban, form jawab (butuh login)
- [x] Desain visual sederhana bertema tanaman (warna hijau/emas, font Fraunces untuk judul)
- [x] README dengan langkah setup Supabase & dua cara deploy ke Vercel (CLI & GitHub)

## Belum dibuat / bisa dikembangkan lagi

- [ ] Edit / hapus pertanyaan atau jawaban dari UI (RLS sudah mengizinkan pemilik, tinggal buat tombolnya)
- [ ] Pencarian pertanyaan berdasarkan kata kunci
- [ ] Paginasi / infinite scroll untuk daftar pertanyaan (saat ini memuat semua sekaligus)
- [ ] Voting / menandai jawaban terbaik
- [ ] Halaman profil pengguna (riwayat pertanyaan & jawaban miliknya)
- [ ] Notifikasi saat pertanyaan dijawab
- [ ] Kompresi/resize gambar sebelum upload
- [ ] Validasi ukuran & tipe file foto di sisi client
- [ ] Reset password (lupa kata sandi)
- [ ] Halaman kategori tersendiri dengan URL (saat ini filter kategori hanya di beranda)
- [ ] Testing otomatis (belum ada unit/e2e test)

## Cara melanjutkan

Semua query Supabase dipanggil langsung dari komponen Svelte lewat `src/lib/supabaseClient.js`
(tidak ada layer API server terpisah). Untuk menambah fitur baru, biasanya cukup:

1. Tambah/ubah tabel & policy di `supabase/schema.sql`, lalu jalankan perubahannya di SQL Editor Supabase.
2. Tambah query di halaman/komponen terkait di `src/routes` atau `src/lib/components`.

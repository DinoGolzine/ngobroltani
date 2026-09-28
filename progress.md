# Progress NgobrolTani

## Sudah dibuat
- [x] Setup SvelteKit + adapter Vercel (mode SPA, `ssr = false`)
- [x] Skema Supabase: `profiles`, `questions`, `answers` + trigger profil otomatis
- [x] Row Level Security untuk semua tabel dan storage bucket `question-images`
- [x] Auth email + password (daftar, masuk, keluar, nama tampilan)
- [x] Beranda: hero dengan kolase foto, pita topik, kartu 5 forum dengan jumlah pertanyaan, diskusi terbaru, tips hari ini, statistik, galeri
- [x] 5 forum: Tips Merawat Tanaman, Cara Memberi Pupuk, Mengatasi Hama, Mengatasi Tanaman Layu, Cara Memilih Bibit
- [x] Panduan lengkap di tiap forum (4 topik per forum sesuai brief) + tab tanya jawab
- [x] Posting pertanyaan (judul, deskripsi, foto opsional dengan pratinjau dan validasi ukuran/tipe)
- [x] Menjawab pertanyaan
- [x] Hapus pertanyaan dan jawaban milik sendiri (foto ikut dihapus dari storage)
- [x] Tandai jawaban terbaik oleh penanya
- [x] Pencarian, filter urutan (terbaru / paling ramai / belum terjawab)
- [x] Desain responsif (mobile), fokus keyboard, dukungan reduced motion
- [x] README cara deploy + `.env.example`

## Belum diuji
- [ ] Build dan jalan langsung: kode ditulis tanpa akses internet, jadi `npm install && npm run build` belum dijalankan. Jalankan sekali di komputer sebelum deploy.

## Ide pengembangan berikutnya
- [ ] Halaman profil dan riwayat pertanyaan pengguna
- [ ] Upvote pada jawaban
- [ ] Edit pertanyaan/jawaban
- [ ] Banyak foto per pertanyaan
- [ ] Notifikasi saat ada jawaban baru
- [ ] Pagination / infinite scroll
- [ ] Moderasi (laporkan postingan, peran admin)
- [ ] Reset password lewat email

const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

export const galeri = [
  u('1416879595882-3373a0480b5b'),
  u('1466692476868-aef1dfb1e735'),
  u('1485955900006-10f4d324d411'),
  u('1530836369250-ef72a3f5cda8'),
  u('1464226184884-fa280b87c399'),
  u('1463936575829-25148e1db1b8')
];

export const forums = [
  {
    slug: 'tips-merawat-tanaman',
    nama: 'Tips Merawat Tanaman',
    emoji: '🌿',
    singkat: 'Perawatan harian',
    tagline: 'Bagaimana sih cara merawat tanaman sehari-hari?',
    warna: ['#1F7A54', '#8ED081'],
    foto: u('1416879595882-3373a0480b5b'),
    intro: 'Tanaman sehat itu hasil kebiasaan kecil yang konsisten: air yang pas, cahaya yang cukup, dan daun yang bersih. Ini dasar-dasarnya.',
    bagian: [
      { ikon: '💧', judul: 'Kapan tanaman perlu disiram', poin: [
        'Tusukkan jari 2-3 cm ke media tanam. Jika kering, saatnya menyiram.',
        'Waktu terbaik: pagi hari (06.00-09.00) atau sore setelah panas reda.',
        'Siram sampai air keluar dari lubang pot, lalu buang air di alas pot.',
        'Musim hujan biasanya butuh penyiraman lebih jarang.'
      ]},
      { ikon: '☀️', judul: 'Kebutuhan cahaya', poin: [
        'Tanaman berbunga dan sayuran umumnya butuh sinar matahari 6 jam atau lebih.',
        'Tanaman hias daun seperti sirih gading cukup dengan cahaya terang tidak langsung.',
        'Putar pot tiap minggu supaya pertumbuhan tidak condong ke satu sisi.',
        'Daun pucat dan batang memanjang tanda tanaman kekurangan cahaya.'
      ]},
      { ikon: '🧽', judul: 'Cara membersihkan daun', poin: [
        'Lap daun dengan kain lembut lembap untuk membuang debu.',
        'Debu yang menumpuk menghalangi tanaman menyerap cahaya.',
        'Untuk daun berbulu, cukup sikat halus atau kuas kering.',
        'Buang daun kuning atau kering dengan gunting bersih.'
      ]},
      { ikon: '🌱', judul: 'Agar tetap sehat', poin: [
        'Ganti media tanam atau repot tiap 1-2 tahun.',
        'Pastikan pot punya lubang drainase.',
        'Periksa bagian bawah daun tiap minggu untuk mendeteksi hama sejak dini.',
        'Beri jarak antar tanaman agar sirkulasi udara lancar.'
      ]}
    ],
    tip: 'Lebih banyak tanaman mati karena kebanyakan disiram daripada kekurangan air. Cek tanah dulu sebelum menyiram.'
  },
  {
    slug: 'cara-memberi-pupuk',
    nama: 'Cara Memberi Pupuk',
    emoji: '🧪',
    singkat: 'Nutrisi tanaman',
    tagline: 'Kalau mau kasih pupuk, caranya gimana?',
    warna: ['#B8741A', '#FFC94D'],
    foto: u('1592150621744-aca64f48394a'),
    intro: 'Pupuk adalah makanan tambahan, bukan pengganti air dan cahaya. Takaran dan waktu yang tepat jauh lebih penting daripada jumlah yang banyak.',
    bagian: [
      { ikon: '⏰', judul: 'Kapan waktu memberi pupuk', poin: [
        'Saat tanaman aktif tumbuh: keluar tunas baru atau daun muda.',
        'Umumnya tiap 2-4 minggu untuk pupuk cair, 1-3 bulan untuk pupuk padat.',
        'Beri pupuk pagi atau sore hari, jangan saat terik.',
        'Kurangi atau hentikan saat tanaman sakit, layu, atau baru dipindah pot.'
      ]},
      { ikon: '🥄', judul: 'Cara memberikan pupuk', poin: [
        'Pupuk padat: taburkan melingkar di tepi pot atau sekitar tajuk, jangan menempel batang.',
        'Pupuk cair: larutkan sesuai petunjuk kemasan, lalu siramkan ke media tanam.',
        'Siram tanah dengan air biasa sebelum memupuk agar akar tidak kaget.',
        'Tutup kembali dengan sedikit tanah lalu siram ringan.'
      ]},
      { ikon: '⚠️', judul: 'Jangan berlebihan', poin: [
        'Pupuk berlebih membuat ujung daun cokelat dan akar terbakar.',
        'Kerak putih di permukaan tanah adalah tanda garam pupuk menumpuk.',
        'Jika terlanjur, bilas media tanam dengan air banyak sampai menetes dari bawah.',
        'Lebih aman memakai dosis setengah tapi lebih sering.'
      ]},
      { ikon: '🪴', judul: 'Contoh pupuk yang biasa dipakai', poin: [
        'Kompos dan pupuk kandang matang: memperbaiki struktur tanah.',
        'NPK: pupuk lengkap untuk pertumbuhan daun, akar, dan bunga.',
        'Urea: memacu daun hijau (pakai sedikit).',
        'Pupuk organik cair (POC) dan air cucian beras yang difermentasi: alternatif ringan.'
      ]}
    ],
    tip: 'Kalau ragu, pakai setengah dosis di kemasan. Tanaman jarang protes kekurangan pupuk, tapi cepat rusak kalau kelebihan.'
  },
  {
    slug: 'mengatasi-hama',
    nama: 'Mengatasi Hama',
    emoji: '🐛',
    singkat: 'Serangan hama',
    tagline: 'Tanaman diserang hama, harus ngapain?',
    warna: ['#C2413A', '#FF9A6B'],
    foto: u('1464226184884-fa280b87c399'),
    intro: 'Hama paling mudah diatasi saat baru muncul. Kenali tandanya, pisahkan tanaman yang terserang, lalu mulai dari cara yang paling sederhana.',
    bagian: [
      { ikon: '🕳️', judul: 'Daun berlubang', poin: [
        'Biasanya ulah ulat, belalang, atau kumbang pemakan daun.',
        'Periksa daun malam hari atau pagi buta, saat hama aktif.',
        'Lubang kecil bulat sering dari kumbang, lubang tidak beraturan dari ulat.',
        'Tandai sejak lubang pertama muncul, jangan tunggu meluas.'
      ]},
      { ikon: '🦗', judul: 'Ada ulat atau serangga', poin: [
        'Ulat: ambil dengan tangan (pakai sarung tangan) atau penjepit.',
        'Kutu putih dan kutu daun: biasanya bergerombol di ujung tunas dan bawah daun.',
        'Semut yang banyak sering menandakan ada kutu daun.',
        'Cari telur di bawah daun dan buang bersama daunnya.'
      ]},
      { ikon: '🍂', judul: 'Daun rusak', poin: [
        'Daun keriting atau bercak lengket: cek kutu daun.',
        'Bintik kuning halus: kemungkinan tungau.',
        'Bercak cokelat berjamur: bisa jamur akibat terlalu lembap.',
        'Pangkas bagian yang rusak parah dan buang jauh dari tanaman lain.'
      ]},
      { ikon: '🧴', judul: 'Cara sederhana menghilangkan hama', poin: [
        'Semprot air bertekanan sedang untuk merontokkan kutu.',
        'Larutan sabun cuci piring ringan (1 sendok teh per liter air) disemprot ke daun.',
        'Ekstrak bawang putih atau minyak neem sebagai pengusir alami.',
        'Isolasi tanaman baru selama 1-2 minggu sebelum digabung.'
      ]}
    ],
    tip: 'Selalu uji semprotan buatan sendiri di satu daun dulu, tunggu sehari, baru semprot ke seluruh tanaman.'
  },
  {
    slug: 'mengatasi-tanaman-layu',
    nama: 'Mengatasi Tanaman Layu',
    emoji: '🥀',
    singkat: 'Darurat tanaman',
    tagline: 'Tanaman tiba-tiba layu, kenapa dan harus gimana?',
    warna: ['#2F6DB5', '#8AD7E8'],
    foto: u('1463936575829-25148e1db1b8'),
    intro: 'Layu adalah sinyal, bukan penyakit. Cari dulu penyebabnya, karena obat untuk kekurangan air justru memperburuk kebanyakan air.',
    bagian: [
      { ikon: '🏜️', judul: 'Kurang air', poin: [
        'Tanah kering dan mengeras, daun lemas tapi masih hijau.',
        'Siram perlahan sampai air keluar dari bawah pot.',
        'Jika tanah menolak air, rendam pot di baskom 15-30 menit.',
        'Biasanya pulih dalam beberapa jam.'
      ]},
      { ikon: '🌊', judul: 'Kebanyakan air', poin: [
        'Tanah becek, daun menguning dan lunak, mungkin ada bau tidak sedap.',
        'Hentikan penyiraman dan biarkan media tanam mengering.',
        'Pindahkan ke tempat teduh berangin, pastikan lubang pot tidak tersumbat.',
        'Jika parah, ganti media tanam dengan yang lebih porous.'
      ]},
      { ikon: '🔥', judul: 'Terlalu panas', poin: [
        'Layu di siang hari dan segar lagi sore hari adalah tanda stres panas.',
        'Pindahkan ke tempat teduh saat matahari paling terik.',
        'Pasang mulsa (jerami, sekam) di permukaan tanah untuk menahan panas dan air.',
        'Siram pagi hari, jangan siram saat tanah masih sangat panas.'
      ]},
      { ikon: '🪱', judul: 'Masalah pada akar', poin: [
        'Keluarkan tanaman dari pot dan periksa akar.',
        'Akar sehat berwarna putih atau krem dan kokoh, akar busuk cokelat, hitam, dan lembek.',
        'Potong akar busuk dengan gunting bersih, lalu tanam di media baru.',
        'Kurangi daun agar akar yang tersisa tidak terbebani.'
      ]}
    ],
    tip: 'Sebelum menyiram tanaman layu, tekan tanahnya. Kering berarti butuh air, basah berarti masalahnya bukan di air.'
  },
  {
    slug: 'cara-memilih-bibit',
    nama: 'Cara Memilih Bibit',
    emoji: '🌰',
    singkat: 'Awal yang baik',
    tagline: 'Bibit seperti apa yang layak dibawa pulang?',
    warna: ['#5B8C2A', '#E3F27A'],
    foto: u('1523348837708-15d4a09cfac2'),
    intro: 'Bibit yang bagus menghemat berbulan-bulan perawatan. Periksa dulu dengan teliti sebelum membeli.',
    bagian: [
      { ikon: '💚', judul: 'Memilih bibit yang sehat', poin: [
        'Pilih bibit yang tampak segar, tegak, dan tumbuh seragam dengan bibit lain.',
        'Ukuran sedang dan kokoh lebih baik daripada terlalu tinggi kurus.',
        'Belilah dari penjual atau penangkar yang jelas.',
        'Tanyakan umur bibit dan cara perawatan awalnya.'
      ]},
      { ikon: '🍃', judul: 'Melihat kondisi daun', poin: [
        'Daun hijau merata, tanpa bercak, lubang, atau gulungan.',
        'Periksa bawah daun untuk telur atau kutu.',
        'Daun yang menguning di dasar bibit kadang normal, tapi jika banyak berarti stres.',
        'Hindari daun dengan lapisan putih seperti tepung atau bercak basah.'
      ]},
      { ikon: '🪵', judul: 'Memeriksa batang', poin: [
        'Batang kokoh, tidak lembek, tidak berlendir, dan tidak patah.',
        'Pangkal batang tidak boleh menghitam atau terlihat busuk.',
        'Goyangkan pelan, bibit yang akarnya baik tidak mudah goyah.',
        'Lihat juga akar yang menyembul dari lubang polybag: putih segar adalah tanda bagus.'
      ]},
      { ikon: '🚫', judul: 'Hindari bibit rusak atau layu', poin: [
        'Bibit layu di tempat sejuk berarti masalahnya bukan hanya panas.',
        'Tanah polybag berbau asam atau berlumut tebal patut dicurigai.',
        'Bibit yang sudah berbunga atau berbuah terlalu dini kadang sudah stres.',
        'Setelah sampai rumah, biarkan beradaptasi di tempat teduh 2-3 hari.'
      ]}
    ],
    tip: 'Bawa pulang dua bibit cadangan. Jika satu gagal, Anda tidak perlu mengulang dari nol.'
  }
];

export const forumBySlug = (slug) => forums.find((f) => f.slug === slug);

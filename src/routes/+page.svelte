<script>
  import { page } from '$app/state';
  import { supabase } from '$lib/supabase.js';
  import { forums, galeri } from '$lib/forums.js';
  import Photo from '$lib/components/Photo.svelte';
  import QuestionCard from '$lib/components/QuestionCard.svelte';
  import { user } from '$lib/auth.js';

  const SELECT = 'id,title,body,forum,image_path,created_at,user_id,profiles(display_name),answers(id,is_best)';

  let pertanyaan = $state([]);
  let loading = $state(true);
  let hitungForum = $state({});
  let stat = $state({ q: 0, a: 0, u: 0 });
  const keyword = $derived(page.url.searchParams.get('q') ?? '');
  const tipHariIni = forums[new Date().getDate() % forums.length];

  $effect(() => {
    muat(keyword);
  });

  async function muat(kw) {
    loading = true;
    let req = supabase.from('questions').select(SELECT).order('created_at', { ascending: false }).limit(20);
    if (kw) req = req.or(`title.ilike.%${kw}%,body.ilike.%${kw}%`);
    const { data } = await req;
    pertanyaan = data ?? [];
    loading = false;
  }

  $effect(() => {
    (async () => {
      const [all, a, u] = await Promise.all([
        supabase.from('questions').select('forum').limit(2000),
        supabase.from('answers').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
      ]);
      const h = {};
      for (const r of all.data ?? []) h[r.forum] = (h[r.forum] ?? 0) + 1;
      hitungForum = h;
      stat = { q: all.data?.length ?? 0, a: a.count ?? 0, u: u.count ?? 0 };
    })();
  });
</script>

<section class="hero">
  <div class="wrap">
    <div>
      <h1>Tanaman bermasalah? Tanya sesama pencinta tanaman.</h1>
      <p class="lead">Dari daun berlubang sampai tanaman yang tiba-tiba layu. Tulis pertanyaanmu, lampirkan foto, dan dapatkan jawaban dari komunitas.</p>
      <form class="search" method="get" action="/">
        <input type="text" name="q" placeholder="Contoh: kenapa daun cabai keriting?" value={keyword} aria-label="Cari pertanyaan" />
        <button class="btn pucuk kecil" style="border:0">Cari</button>
      </form>
      <div class="cta-row">
        <a class="btn" href="/tanya">Tulis pertanyaan</a>
        <a class="btn ghost" href="#forum">Lihat forum</a>
      </div>
    </div>
    <div class="collage" aria-hidden="true">
      <Photo cls="c1" src={galeri[0]} />
      <Photo cls="c2" src={galeri[1]} />
      <Photo cls="c3" src={galeri[2]} />
      <span class="bubble b1">💧 Siram pagi hari</span>
      <span class="bubble b2">🌱 {stat.q} pertanyaan</span>
    </div>
  </div>
</section>

<div class="pita" aria-hidden="true">
  <div>
    {#each [1, 2] as _}
      {#each forums as f}<span>{f.emoji} {f.tagline}</span>{/each}
    {/each}
  </div>
</div>

<section class="sec" id="forum">
  <div class="wrap">
    <div class="sec-head">
      <h2>Pilih forum yang kamu butuhkan</h2>
      <span class="muted">Tiap forum punya panduan singkat dan ruang tanya jawab.</span>
    </div>
    <div class="forum-grid">
      {#each forums as f}
        <a class="fcard" href="/forum/{f.slug}" style="--g1:{f.warna[0]}">
          <Photo src={f.foto} alt={f.nama} />
          <span class="emo">{f.emoji}</span>
          <span class="cnt">{hitungForum[f.slug] ?? 0} tanya</span>
          <h3>{f.nama}</h3>
          <p>{f.tagline}</p>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="sec" id="diskusi">
  <div class="wrap cols">
    <div>
      <div class="sec-head">
        <h2>{keyword ? `Hasil untuk "${keyword}"` : 'Diskusi terbaru'}</h2>
        {#if keyword}<a class="btn ghost kecil" href="/">Hapus pencarian</a>{/if}
      </div>
      {#if loading}
        <div class="loading">Memuat pertanyaan...</div>
      {:else if pertanyaan.length === 0}
        <div class="empty">
          <div class="big">🪴</div>
          <p>{keyword ? 'Belum ada pertanyaan yang cocok.' : 'Belum ada pertanyaan.'}</p>
          <a class="btn" style="margin-top:12px" href="/tanya">Jadi yang pertama bertanya</a>
        </div>
      {:else}
        <div class="qlist">{#each pertanyaan as q (q.id)}<QuestionCard {q} />{/each}</div>
      {/if}
    </div>

    <aside class="aside">
      <div class="box tip-box">
        <h3>{tipHariIni.emoji} Tips hari ini</h3>
        <p>{tipHariIni.tip}</p>
        <a class="btn kecil" style="margin-top:12px" href="/forum/{tipHariIni.slug}">Baca panduannya</a>
      </div>
      <div class="box">
        <h3>Komunitas</h3>
        <div class="stats">
          <div><b>{stat.q}</b><small>pertanyaan</small></div>
          <div><b>{stat.a}</b><small>jawaban</small></div>
          <div><b>{stat.u}</b><small>anggota</small></div>
        </div>
      </div>
      <div class="box">
        <h3>Galeri kebun</h3>
        <div class="gal">
          {#each galeri.slice(2, 6) as g}<Photo src={g} />{/each}
        </div>
      </div>
      {#if !$user}
        <div class="box">
          <h3>Gabung gratis</h3>
          <p class="muted">Daftar dengan email untuk bertanya dan menjawab.</p>
          <a class="btn pucuk kecil" style="margin-top:10px" href="/masuk?daftar=1">Daftar sekarang</a>
        </div>
      {/if}
    </aside>
  </div>
</section>

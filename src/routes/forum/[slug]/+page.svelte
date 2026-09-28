<script>
  import { page } from '$app/state';
  import { supabase } from '$lib/supabase.js';
  import { forums, forumBySlug, galeri } from '$lib/forums.js';
  import Photo from '$lib/components/Photo.svelte';
  import QuestionCard from '$lib/components/QuestionCard.svelte';

  const SELECT = 'id,title,body,forum,image_path,created_at,user_id,profiles(display_name),answers(id,is_best)';

  const slug = $derived(page.params.slug);
  const forum = $derived(forumBySlug(slug));
  let tab = $state('panduan');
  let pertanyaan = $state([]);
  let loading = $state(true);
  let urut = $state('terbaru');

  const tampil = $derived(
    urut === 'belum'
      ? pertanyaan.filter((q) => !q.answers?.some((a) => a.is_best))
      : urut === 'populer'
        ? [...pertanyaan].sort((a, b) => (b.answers?.length ?? 0) - (a.answers?.length ?? 0))
        : pertanyaan
  );

  $effect(() => {
    muat(slug);
  });

  async function muat(s) {
    tab = 'panduan';
    loading = true;
    const { data } = await supabase.from('questions').select(SELECT).eq('forum', s).order('created_at', { ascending: false });
    pertanyaan = data ?? [];
    loading = false;
  }
</script>

<svelte:head><title>{forum?.nama ?? 'Forum'} - NgobrolTani</title></svelte:head>

{#if !forum}
  <div class="wrap sec"><div class="empty"><div class="big">🥀</div><p>Forum tidak ditemukan.</p><a class="btn" href="/">Kembali</a></div></div>
{:else}
  <div class="wrap">
    <div class="banner" style="--g1:{forum.warna[0]}">
      <Photo src={forum.foto} alt={forum.nama} />
      <h1>{forum.emoji} {forum.nama}</h1>
      <p>{forum.tagline}</p>
    </div>

    <div class="cols" style="padding-bottom:20px">
      <div>
        <div class="tabs" role="tablist">
          <button class="tab" class:on={tab === 'panduan'} onclick={() => (tab = 'panduan')}>Panduan</button>
          <button class="tab" class:on={tab === 'diskusi'} onclick={() => (tab = 'diskusi')}>Tanya jawab ({pertanyaan.length})</button>
          <a class="btn pucuk" style="margin-left:auto" href="/tanya?forum={forum.slug}">+ Tulis pertanyaan</a>
        </div>

        {#if tab === 'panduan'}
          <p style="font-size:1.1rem;margin-bottom:18px">{forum.intro}</p>
          <div class="guide">
            {#each forum.bagian as b}
              <article class="gcard">
                <div class="ico">{b.ikon}</div>
                <div>
                  <h3>{b.judul}</h3>
                  <ul>{#each b.poin as p}<li>{p}</li>{/each}</ul>
                </div>
              </article>
            {/each}
          </div>
          <div class="box tip-box" style="margin-top:20px">
            <h3>Masih bingung?</h3>
            <p>Tanyakan langsung ke komunitas, lengkapi dengan foto supaya lebih mudah dijawab.</p>
            <button class="btn kecil" style="margin-top:10px" onclick={() => (tab = 'diskusi')}>Lihat diskusi</button>
          </div>
        {:else}
          <div class="tabs">
            <button class="tab" class:on={urut === 'terbaru'} onclick={() => (urut = 'terbaru')}>Terbaru</button>
            <button class="tab" class:on={urut === 'populer'} onclick={() => (urut = 'populer')}>Paling ramai</button>
            <button class="tab" class:on={urut === 'belum'} onclick={() => (urut = 'belum')}>Belum terjawab</button>
          </div>
          {#if loading}
            <div class="loading">Memuat...</div>
          {:else if tampil.length === 0}
            <div class="empty">
              <div class="big">{forum.emoji}</div>
              <p>Belum ada pertanyaan di sini.</p>
              <a class="btn" style="margin-top:12px" href="/tanya?forum={forum.slug}">Tulis pertanyaan pertama</a>
            </div>
          {:else}
            <div class="qlist">{#each tampil as q (q.id)}<QuestionCard {q} tampilForum={false} />{/each}</div>
          {/if}
        {/if}
      </div>

      <aside class="aside">
        <div class="box tip-box"><h3>{forum.emoji} Ingat selalu</h3><p>{forum.tip}</p></div>
        <div class="box">
          <h3>Forum lainnya</h3>
          {#each forums as f}
            <a class="side-link" class:on={f.slug === slug} href="/forum/{f.slug}">{f.emoji} {f.nama}</a>
          {/each}
        </div>
        <div class="box">
          <h3>Galeri kebun</h3>
          <div class="gal">{#each galeri.slice(0, 4) as g}<Photo src={g} />{/each}</div>
        </div>
      </aside>
    </div>
  </div>
{/if}

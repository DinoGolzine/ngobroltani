<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { supabase, configured } from '$lib/supabase.js';
  import { user, ready } from '$lib/auth.js';
  import { forums } from '$lib/forums.js';
  import { initial, avatarColor } from '$lib/utils.js';

  let { children } = $props();
  let q = $state('');
  const nama = $derived($user?.user_metadata?.display_name || $user?.email?.split('@')[0] || '');

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    user.set(data.session?.user ?? null);
    ready.set(true);
    supabase.auth.onAuthStateChange((_e, s) => user.set(s?.user ?? null));
  });

  function cari(e) {
    e.preventDefault();
    goto(`/?q=${encodeURIComponent(q.trim())}#diskusi`);
  }
  async function keluar() {
    await supabase.auth.signOut();
    goto('/');
  }
</script>

<svelte:head><title>NgobrolTani - Tanya Jawab Perawatan Tanaman</title></svelte:head>

<header class="nav">
  <div class="wrap">
    <a class="logo" href="/"><i>🌱</i> NgobrolTani</a>
    <nav class="nav-links">
      <a href="/" class:on={page.url.pathname === '/'}>Beranda</a>
      <a href="/forum/{forums[0].slug}" class:on={page.url.pathname.startsWith('/forum')}>Forum</a>
    </nav>
    <span class="spacer"></span>
    <form class="search" onsubmit={cari}>
      <input type="text" placeholder="Cari pertanyaan..." bind:value={q} aria-label="Cari pertanyaan" />
      <button aria-label="Cari">Cari</button>
    </form>
    {#if $user}
      <span class="chip-user">
        <span class="avatar" style="background:{avatarColor(nama)}">{initial(nama)}</span>
      </span>
      <a class="btn pucuk kecil" href="/tanya">+ Tanya</a>
      <button class="btn ghost kecil" onclick={keluar}>Keluar</button>
    {:else if $ready}
      <a class="btn ghost kecil" href="/masuk">Masuk</a>
      <a class="btn kecil" href="/masuk?daftar=1">Daftar</a>
    {/if}
  </div>
</header>

{#if !configured}
  <div class="wrap" style="margin-top:16px">
    <div class="alert warn">
      Supabase belum dikonfigurasi. Isi PUBLIC_SUPABASE_URL dan PUBLIC_SUPABASE_ANON_KEY (lihat README).
    </div>
  </div>
{/if}

<main>{@render children()}</main>

<footer>
  <div class="wrap" style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap">
    <div><b>NgobrolTani</b><br />Tempat bertanya dan berbagi soal tanaman.</div>
    <div>
      {#each forums as f}<a class="side-link" style="color:#cfe6d5" href="/forum/{f.slug}">{f.emoji} {f.nama}</a>{/each}
    </div>
  </div>
</footer>

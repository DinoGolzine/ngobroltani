<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/auth.js';
  import Photo from '$lib/components/Photo.svelte';
  import { galeri } from '$lib/forums.js';

  let daftar = $state(page.url.searchParams.get('daftar') === '1');
  let email = $state('');
  let password = $state('');
  let nama = $state('');
  let error = $state('');
  let info = $state('');
  let loading = $state(false);
  const next = $derived(page.url.searchParams.get('next') || '/');

  $effect(() => {
    if ($user) goto(next.startsWith('/') ? next : '/');
  });

  async function kirim(e) {
    e.preventDefault();
    error = info = '';
    loading = true;
    if (daftar) {
      if (password.length < 6) { loading = false; return (error = 'Password minimal 6 karakter.'); }
      const { data, error: err } = await supabase.auth.signUp({
        email, password, options: { data: { display_name: nama.trim() } }
      });
      loading = false;
      if (err) return (error = err.message);
      if (!data.session) info = 'Pendaftaran berhasil. Cek email kamu untuk konfirmasi, lalu masuk.';
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      loading = false;
      if (err) error = err.message === 'Invalid login credentials' ? 'Email atau password salah.' : err.message;
    }
  }
</script>

<svelte:head><title>{daftar ? 'Daftar' : 'Masuk'} - NgobrolTani</title></svelte:head>

<div class="auth">
  <div class="visual">
    <Photo src={galeri[1]} />
    <h2>Tanya, jawab, dan tumbuh bersama.</h2>
    <p>Gabung dengan komunitas pencinta tanaman dan bagikan foto serta pengalamanmu.</p>
  </div>
  <div class="panel">
    <form class="form" onsubmit={kirim}>
      <h1 style="font-size:2rem">{daftar ? 'Buat akun' : 'Selamat datang kembali'}</h1>
      {#if daftar}
        <label>Nama tampilan
          <input type="text" bind:value={nama} maxlength="40" placeholder="Nama panggilanmu" required />
        </label>
      {/if}
      <label>Email <input type="email" bind:value={email} autocomplete="email" required /></label>
      <label>Password
        <input type="password" bind:value={password} autocomplete={daftar ? 'new-password' : 'current-password'} required />
      </label>
      {#if error}<div class="alert err">{error}</div>{/if}
      {#if info}<div class="alert ok">{info}</div>{/if}
      <button class="btn" disabled={loading}>{loading ? 'Memproses...' : daftar ? 'Daftar' : 'Masuk'}</button>
      <button type="button" class="btn ghost" onclick={() => { daftar = !daftar; error = info = ''; }}>
        {daftar ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
      </button>
    </form>
  </div>
</div>

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { supabase } from '$lib/supabase.js';
  import { user, ready } from '$lib/auth.js';
  import { forums } from '$lib/forums.js';

  const MAX_MB = 5;
  let forum = $state(page.url.searchParams.get('forum') || forums[0].slug);
  let title = $state('');
  let body = $state('');
  let file = $state(null);
  let preview = $state('');
  let error = $state('');
  let sending = $state(false);

  $effect(() => {
    if ($ready && !$user) goto(`/masuk?next=${encodeURIComponent('/tanya?forum=' + forum)}`);
  });

  function pilihFoto(e) {
    error = '';
    const f = e.target.files?.[0];
    if (!f) return hapusFoto();
    if (!f.type.startsWith('image/')) { error = 'File harus berupa gambar.'; return hapusFoto(); }
    if (f.size > MAX_MB * 1024 * 1024) { error = `Ukuran foto maksimal ${MAX_MB} MB.`; return hapusFoto(); }
    file = f;
    preview = URL.createObjectURL(f);
  }
  function hapusFoto() {
    file = null;
    preview = '';
  }

  async function kirim(e) {
    e.preventDefault();
    error = '';
    if (title.trim().length < 5) return (error = 'Judul minimal 5 karakter.');
    if (body.trim().length < 10) return (error = 'Deskripsi minimal 10 karakter.');
    sending = true;
    let image_path = null;
    if (file) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      image_path = `${$user.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from('question-images').upload(image_path, file, { contentType: file.type });
      if (up.error) { sending = false; return (error = 'Gagal mengunggah foto: ' + up.error.message); }
    }
    const { data, error: err } = await supabase
      .from('questions')
      .insert({ user_id: $user.id, forum, title: title.trim(), body: body.trim(), image_path })
      .select('id')
      .single();
    if (err) {
      if (image_path) await supabase.storage.from('question-images').remove([image_path]);
      sending = false;
      return (error = 'Gagal mengirim pertanyaan: ' + err.message);
    }
    goto(`/pertanyaan/${data.id}`);
  }
</script>

<svelte:head><title>Tulis Pertanyaan - NgobrolTani</title></svelte:head>

<div class="wrap sec" style="max-width:780px">
  <h1 style="font-size:clamp(2rem,4.5vw,3rem);color:var(--daun);margin-bottom:6px">Tulis pertanyaan</h1>
  <p class="muted" style="margin-bottom:22px">Semakin jelas ceritamu, semakin mudah orang menjawab. Foto boleh dilampirkan, tidak wajib.</p>

  <form class="form" onsubmit={kirim}>
    <label>Forum
      <select bind:value={forum}>
        {#each forums as f}<option value={f.slug}>{f.emoji} {f.nama}</option>{/each}
      </select>
    </label>
    <label>Judul pertanyaan
      <input type="text" maxlength="150" placeholder="Contoh: Daun cabai saya keriting, kenapa ya?" bind:value={title} required />
    </label>
    <label>Deskripsi
      <small>Ceritakan jenis tanaman, sudah berapa lama, dan apa yang sudah dicoba.</small>
      <textarea maxlength="5000" bind:value={body} required></textarea>
    </label>
    <div>
      <span style="font-weight:700">Foto <small class="muted" style="font-weight:400">(opsional, maksimal {MAX_MB} MB)</small></span>
      {#if preview}
        <div class="preview" style="margin-top:8px">
          <img src={preview} alt="Pratinjau foto" />
          <div class="actions"><button type="button" class="btn bahaya kecil" onclick={hapusFoto}>Hapus foto</button></div>
        </div>
      {:else}
        <label class="drop" style="margin-top:8px">
          <span style="font-size:2rem">📷</span><br />Klik untuk memilih foto tanaman
          <input type="file" accept="image/*" onchange={pilihFoto} hidden />
        </label>
      {/if}
    </div>
    {#if error}<div class="alert err">{error}</div>{/if}
    <button class="btn" disabled={sending}>{sending ? 'Mengirim...' : 'Kirim pertanyaan'}</button>
  </form>
</div>

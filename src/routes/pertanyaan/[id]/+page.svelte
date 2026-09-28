<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/auth.js';
  import { forumBySlug } from '$lib/forums.js';
  import { timeAgo, imageUrl, authorName, initial, avatarColor } from '$lib/utils.js';

  const id = $derived(page.params.id);
  let q = $state(null);
  let answers = $state([]);
  let loading = $state(true);
  let body = $state('');
  let sending = $state(false);
  let error = $state('');

  const forum = $derived(q ? forumBySlug(q.forum) : null);
  const pemilik = $derived(q && $user && q.user_id === $user.id);

  $effect(() => {
    muat(id);
  });

  async function muatJawaban(qid) {
    const { data } = await supabase
      .from('answers')
      .select('*, profiles(display_name)')
      .eq('question_id', qid)
      .order('is_best', { ascending: false })
      .order('created_at', { ascending: true });
    answers = data ?? [];
  }

  async function muat(qid) {
    loading = true;
    const { data } = await supabase.from('questions').select('*, profiles(display_name)').eq('id', qid).maybeSingle();
    q = data;
    if (data) await muatJawaban(qid);
    loading = false;
  }

  async function kirimJawaban(e) {
    e.preventDefault();
    error = '';
    if (body.trim().length < 2) return (error = 'Jawaban terlalu pendek.');
    sending = true;
    const { error: err } = await supabase.from('answers').insert({ question_id: id, user_id: $user.id, body: body.trim() });
    sending = false;
    if (err) return (error = 'Gagal mengirim jawaban: ' + err.message);
    body = '';
    await muatJawaban(id);
  }

  async function hapusJawaban(a) {
    if (!confirm('Hapus jawaban ini?')) return;
    const { error: err } = await supabase.from('answers').delete().eq('id', a.id);
    if (err) return (error = 'Gagal menghapus: ' + err.message);
    await muatJawaban(id);
  }

  async function tandaiTerbaik(a) {
    const jadi = !a.is_best;
    await supabase.from('answers').update({ is_best: false }).eq('question_id', id);
    if (jadi) await supabase.from('answers').update({ is_best: true }).eq('id', a.id);
    await muatJawaban(id);
  }

  async function hapusPertanyaan() {
    if (!confirm('Hapus pertanyaan ini beserta semua jawabannya?')) return;
    if (q.image_path) await supabase.storage.from('question-images').remove([q.image_path]);
    const { error: err } = await supabase.from('questions').delete().eq('id', id);
    if (err) return (error = 'Gagal menghapus: ' + err.message);
    goto(`/forum/${q.forum}`);
  }
</script>

<svelte:head><title>{q?.title ?? 'Pertanyaan'} - NgobrolTani</title></svelte:head>

<div class="wrap sec" style="max-width:860px">
  {#if loading}
    <div class="loading">Memuat...</div>
  {:else if !q}
    <div class="empty"><div class="big">🥀</div><p>Pertanyaan tidak ditemukan atau sudah dihapus.</p><a class="btn" href="/">Ke beranda</a></div>
  {:else}
    <article class="qdetail">
      {#if forum}<a class="tag" href="/forum/{forum.slug}">{forum.emoji} {forum.nama}</a>{/if}
      <h1>{q.title}</h1>
      <div class="author">
        <span class="avatar" style="background:{avatarColor(authorName(q))}">{initial(authorName(q))}</span>
        <div><b>{authorName(q)}</b><br /><small class="muted">{timeAgo(q.created_at)}</small></div>
      </div>
      <p class="qbody" style="margin-top:18px">{q.body}</p>
      {#if q.image_path}
        <a href={imageUrl(q.image_path)} target="_blank" rel="noopener"><img class="qimg" src={imageUrl(q.image_path)} alt="Foto pada pertanyaan" /></a>
      {/if}
      {#if pemilik}
        <div class="actions"><button class="btn bahaya kecil" onclick={hapusPertanyaan}>Hapus pertanyaan</button></div>
      {/if}
    </article>

    <h2 style="margin:32px 0 14px;font-size:1.7rem">{answers.length} jawaban</h2>
    <div class="qlist">
      {#each answers as a (a.id)}
        <div class="answer" class:best={a.is_best}>
          <div class="top">
            <div class="author">
              <span class="avatar kecil" style="background:{avatarColor(authorName(a))}">{initial(authorName(a))}</span>
              <b>{authorName(a)}</b><small class="muted">{timeAgo(a.created_at)}</small>
            </div>
            {#if a.is_best}<span class="best-flag">✓ Jawaban terbaik</span>{/if}
          </div>
          <p class="qbody">{a.body}</p>
          {#if pemilik || $user?.id === a.user_id}
            <div class="actions">
              {#if pemilik}
                <button class="btn ghost kecil" onclick={() => tandaiTerbaik(a)}>{a.is_best ? 'Batalkan tanda terbaik' : 'Tandai jawaban terbaik'}</button>
              {/if}
              {#if $user?.id === a.user_id}
                <button class="btn bahaya kecil" onclick={() => hapusJawaban(a)}>Hapus</button>
              {/if}
            </div>
          {/if}
        </div>
      {:else}
        <div class="empty"><div class="big">💬</div><p>Belum ada jawaban. Bagikan pengalamanmu!</p></div>
      {/each}
    </div>

    <div style="margin-top:28px">
      {#if $user}
        <form class="form" onsubmit={kirimJawaban}>
          <label>Jawabanmu
            <textarea bind:value={body} maxlength="5000" placeholder="Tulis saran atau pengalamanmu..." required></textarea>
          </label>
          {#if error}<div class="alert err">{error}</div>{/if}
          <button class="btn" disabled={sending}>{sending ? 'Mengirim...' : 'Kirim jawaban'}</button>
        </form>
      {:else}
        <div class="box" style="text-align:center">
          <p style="margin-bottom:10px">Masuk untuk ikut menjawab pertanyaan ini.</p>
          <a class="btn" href="/masuk?next={encodeURIComponent('/pertanyaan/' + id)}">Masuk atau daftar</a>
        </div>
      {/if}
    </div>
  {/if}
</div>

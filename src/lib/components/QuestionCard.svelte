<script>
  import Photo from './Photo.svelte';
  import { forumBySlug } from '$lib/forums.js';
  import { timeAgo, imageUrl, authorName, initial, avatarColor } from '$lib/utils.js';

  let { q, tampilForum = true } = $props();
  const jumlah = $derived(q.answers?.length ?? 0);
  const terjawab = $derived(q.answers?.some((a) => a.is_best));
  const forum = $derived(forumBySlug(q.forum));
  const nama = $derived(authorName(q));
</script>

<a class="qcard" href="/pertanyaan/{q.id}">
  <div class="ans-badge" class:ok={terjawab}>
    <b>{jumlah}</b><small>{terjawab ? 'terjawab' : 'jawaban'}</small>
  </div>
  <div>
    <h3>{q.title}</h3>
    <p>{q.body}</p>
    <div class="qmeta">
      {#if tampilForum && forum}<span class="tag">{forum.emoji} {forum.nama}</span>{/if}
      <span class="avatar kecil" style="background:{avatarColor(nama)}">{initial(nama)}</span>
      <span>{nama}</span>
      <span>{timeAgo(q.created_at)}</span>
    </div>
  </div>
  {#if q.image_path}
    <Photo cls="thumb" src={imageUrl(q.image_path)} alt="Foto pertanyaan" />
  {/if}
</a>

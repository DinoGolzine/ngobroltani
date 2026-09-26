<script>
  export let answer;

  $: authorName = answer.profiles?.display_name || answer.profiles?.email || 'Pengguna';
</script>

<div class="answer">
  <p class="content">{answer.content}</p>
  {#if answer.image_url}
    <img src={answer.image_url} alt="" />
  {/if}
  <div class="meta">
    <span class="author">{authorName}</span>
    <span class="dot">·</span>
    <span>{new Date(answer.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
  </div>
</div>

<style>
  .answer {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-card);
    padding: 1rem 1.1rem;
    margin-bottom: 0.7rem;
  }
  .content {
    margin: 0 0 0.5rem;
    white-space: pre-wrap;
    font-size: 0.94rem;
  }
  img {
    max-width: 100%;
    max-height: 320px;
    object-fit: cover;
    border-radius: var(--radius-control);
    margin-bottom: 0.6rem;
    display: block;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.76rem;
    color: var(--muted);
  }
  .author {
    color: var(--primary-dark);
    font-weight: 600;
  }
  .dot {
    opacity: 0.6;
  }
</style>

<script>
  export let question;

  $: excerpt =
    question.description?.length > 140
      ? question.description.slice(0, 140).trimEnd() + '…'
      : question.description;

  $: answerCount = question.answers?.[0]?.count ?? 0;
  $: authorName = question.profiles?.display_name || question.profiles?.email || 'Pengguna';
</script>

<a class="card" href={`/questions/${question.id}`}>
  {#if question.image_url}
    <img class="thumb" src={question.image_url} alt="" />
  {/if}
  <div class="card-main">
    {#if question.categories}
      <span class="badge">{question.categories.name}</span>
    {/if}
    <h3>{question.title}</h3>
    <p>{excerpt}</p>
    <div class="meta">
      <span class="author">Oleh {authorName}</span>
      <span class="dot">·</span>
      <span>{new Date(question.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      <span class="dot">·</span>
      <span>{answerCount} jawaban</span>
    </div>
  </div>
</a>

<style>
  .card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-card);
    padding: 1.1rem 1.25rem;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s ease;
  }
  .card:hover {
    border-color: var(--primary);
  }
  .card-main {
    flex: 1;
    min-width: 0;
  }
  .badge {
    display: inline-block;
    background: var(--surface-soft);
    color: var(--primary-dark);
    padding: 0.15rem 0.6rem;
    border-radius: var(--radius-pill);
    font-size: 0.72rem;
    margin-bottom: 0.5rem;
  }
  h3 {
    font-size: 1.1rem;
    margin: 0 0 0.35rem;
  }
  p {
    margin: 0 0 0.6rem;
    color: var(--ink-soft);
    font-size: 0.92rem;
  }
  .meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    font-size: 0.78rem;
    color: var(--muted);
  }
  .author {
    color: var(--primary-dark);
    font-weight: 600;
  }
  .dot {
    opacity: 0.6;
  }
  .thumb {
    width: 84px;
    height: 84px;
    object-fit: cover;
    border-radius: 10px;
    flex-shrink: 0;
    order: -1;
  }
  @media (max-width: 480px) {
    .thumb {
      width: 64px;
      height: 64px;
    }
  }
</style>

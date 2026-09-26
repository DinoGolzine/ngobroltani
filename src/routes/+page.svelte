<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import QuestionCard from '$lib/components/QuestionCard.svelte';

  let categories = [];
  let questions = [];
  let loading = true;
  let selectedCategory = null;
  let error = '';

  async function loadCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    categories = data ?? [];
  }

  async function loadQuestions() {
    loading = true;
    error = '';
    let query = supabase
      .from('questions')
      .select('id, title, description, image_url, created_at, category_id, categories(name), answers(count), profiles(display_name, email)')
      .order('created_at', { ascending: false });

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data, error: err } = await query;
    if (err) {
      error = err.message;
    } else {
      questions = data ?? [];
    }
    loading = false;
  }

  function selectCategory(id) {
    selectedCategory = selectedCategory === id ? null : id;
    loadQuestions();
  }

  onMount(async () => {
    await loadCategories();
    await loadQuestions();
  });
</script>

<section class="hero">
  <h1>Tanya jawab seputar merawat tanaman</h1>
  <p>Bingung soal tanaman di rumah? Tanyakan di sini, atau bantu jawab pertanyaan orang lain.</p>
</section>

{#if categories.length}
  <div class="categories">
    {#each categories as cat (cat.id)}
      <button
        type="button"
        class:active={selectedCategory === cat.id}
        on:click={() => selectCategory(cat.id)}
      >
        {cat.name}
      </button>
    {/each}
  </div>
{/if}

{#if error}
  <p class="error">Gagal memuat pertanyaan: {error}</p>
{/if}

{#if loading}
  <p class="hint">Memuat pertanyaan…</p>
{:else if questions.length === 0}
  <div class="empty">
    <p>Belum ada pertanyaan di sini.</p>
    <a class="cta" href="/questions/new">Jadilah yang pertama bertanya</a>
  </div>
{:else}
  <div class="list">
    {#each questions as q (q.id)}
      <QuestionCard question={q} />
    {/each}
  </div>
{/if}

<style>
  .hero {
    margin-bottom: 1.75rem;
  }
  .hero h1 {
    font-size: 1.9rem;
    margin-bottom: 0.4rem;
  }
  .hero p {
    color: var(--ink-soft);
    max-width: 46ch;
  }
  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.75rem;
  }
  .categories button {
    padding: 0.4rem 0.95rem;
    border-radius: var(--radius-pill);
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--primary-dark);
    cursor: pointer;
    font-size: 0.84rem;
  }
  .categories button.active {
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .hint {
    color: var(--muted);
  }
  .error {
    color: var(--danger);
  }
  .empty {
    text-align: center;
    padding: 2.5rem 1rem;
    background: var(--surface);
    border: 1px dashed var(--line);
    border-radius: var(--radius-card);
  }
  .empty p {
    color: var(--ink-soft);
    margin-bottom: 0.9rem;
  }
  .cta {
    display: inline-block;
    background: var(--primary);
    color: #fff;
    text-decoration: none;
    padding: 0.55rem 1.2rem;
    border-radius: var(--radius-control);
    font-size: 0.9rem;
  }
</style>

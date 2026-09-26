<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabaseClient';
  import { user, authLoading } from '$lib/stores/auth';
  import AnswerCard from '$lib/components/AnswerCard.svelte';

  let question = null;
  let answers = [];
  let loading = true;
  let notFound = false;
  let error = '';

  let answerContent = '';
  let answerImageFile = null;
  let answerImagePreview = '';
  let submitting = false;
  let answerError = '';

  $: questionId = $page.params.id;
  $: authorName = question?.profiles?.display_name || question?.profiles?.email || 'Pengguna';

  async function loadQuestion() {
    const { data, error: err } = await supabase
      .from('questions')
      .select('*, categories(name), profiles(display_name, email)')
      .eq('id', questionId)
      .maybeSingle();
    if (err) {
      error = err.message;
    } else if (!data) {
      notFound = true;
    } else {
      question = data;
    }
  }

  async function loadAnswers() {
    const { data } = await supabase
      .from('answers')
      .select('*, profiles(display_name, email)')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true });
    answers = data ?? [];
  }

  function handleAnswerFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    answerImageFile = file;
    answerImagePreview = file ? URL.createObjectURL(file) : '';
  }

  async function handleAnswerSubmit() {
    if (!$user) return;
    submitting = true;
    answerError = '';

    try {
      let imageUrl = null;

      if (answerImageFile) {
        const ext = answerImageFile.name.split('.').pop();
        const path = `${$user.id}/a-${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('question-images')
          .upload(path, answerImageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from('question-images').getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { error: err } = await supabase.from('answers').insert({
        question_id: questionId,
        user_id: $user.id,
        content: answerContent,
        image_url: imageUrl
      });

      if (err) throw err;

      answerContent = '';
      answerImageFile = null;
      answerImagePreview = '';
      await loadAnswers();
    } catch (e) {
      answerError = e.message ?? 'Terjadi kesalahan, coba lagi.';
    } finally {
      submitting = false;
    }
  }

  onMount(async () => {
    loading = true;
    await loadQuestion();
    if (question) await loadAnswers();
    loading = false;
  });
</script>

{#if loading}
  <p class="hint">Memuat…</p>
{:else if notFound}
  <p class="hint">Pertanyaan tidak ditemukan.</p>
{:else if error}
  <p class="error">Gagal memuat: {error}</p>
{:else if question}
  <article class="question">
    {#if question.categories}
      <span class="badge">{question.categories.name}</span>
    {/if}
    <h1>{question.title}</h1>
    <p class="body">{question.description}</p>
    {#if question.image_url}
      <img src={question.image_url} alt="" />
    {/if}
    <p class="meta">
      Oleh <span class="author">{authorName}</span> · {new Date(question.created_at).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </p>
  </article>

  <section class="answers">
    <h2>{answers.length} {answers.length === 1 ? 'Jawaban' : 'Jawaban'}</h2>

    {#each answers as a (a.id)}
      <AnswerCard answer={a} />
    {:else}
      <p class="hint">Belum ada jawaban. Jadilah yang pertama menjawab.</p>
    {/each}

    {#if !$authLoading}
      {#if $user}
        <form on:submit|preventDefault={handleAnswerSubmit}>
          <textarea bind:value={answerContent} rows="4" placeholder="Tulis jawabanmu…" required></textarea>

          <label class="file-label">
            Sertakan foto (opsional)
            <input type="file" accept="image/*" on:change={handleAnswerFileChange} />
          </label>

          {#if answerImagePreview}
            <img class="preview" src={answerImagePreview} alt="Pratinjau foto jawaban" />
          {/if}

          {#if answerError}<p class="error">{answerError}</p>{/if}
          <button type="submit" disabled={submitting}>{submitting ? 'Mengirim…' : 'Kirim jawaban'}</button>
        </form>
      {:else}
        <p class="hint">Silakan <a href="/login">masuk</a> untuk menjawab.</p>
      {/if}
    {/if}
  </section>
{/if}

<style>
  .question {
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 1.35rem 1.5rem;
    border-radius: var(--radius-card);
    margin-bottom: 1.75rem;
  }
  .badge {
    display: inline-block;
    background: var(--surface-soft);
    color: var(--primary-dark);
    padding: 0.15rem 0.6rem;
    border-radius: var(--radius-pill);
    font-size: 0.72rem;
  }
  h1 {
    font-size: 1.45rem;
    margin: 0.55rem 0 0.75rem;
  }
  .body {
    white-space: pre-wrap;
    color: var(--ink-soft);
    margin: 0;
  }
  img {
    max-width: 100%;
    border-radius: var(--radius-control);
    margin-top: 0.9rem;
  }
  .meta {
    font-size: 0.76rem;
    color: var(--muted);
    margin: 1rem 0 0;
  }
  .author {
    color: var(--primary-dark);
    font-weight: 600;
  }
  .answers h2 {
    font-size: 1.05rem;
    margin-bottom: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    margin-top: 1.25rem;
  }
  textarea {
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--line);
    border-radius: var(--radius-control);
    font-family: inherit;
    font-size: 0.95rem;
    resize: vertical;
    background: var(--surface);
    color: var(--ink);
  }
  .file-label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.82rem;
    color: var(--ink-soft);
  }
  .preview {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: var(--radius-control);
    border: 1px solid var(--line);
    margin-top: 0;
  }
  button {
    padding: 0.6rem 1.4rem;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: var(--radius-control);
    cursor: pointer;
    font-weight: 600;
    align-self: flex-start;
  }
  button:disabled {
    opacity: 0.6;
    cursor: default;
  }
  .hint {
    color: var(--ink-soft);
  }
  .error {
    color: var(--danger);
    font-size: 0.85rem;
    margin: 0;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { user, authLoading } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let categories = [];
  let title = '';
  let description = '';
  let categoryId = '';
  let imageFile = null;
  let imagePreview = '';
  let error = '';
  let loading = false;

  onMount(async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    categories = data ?? [];
    if (categories.length) categoryId = categories[0].id;
  });

  function handleFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    imageFile = file;
    imagePreview = file ? URL.createObjectURL(file) : '';
  }

  async function handleSubmit() {
    if (!$user) {
      goto('/login');
      return;
    }
    loading = true;
    error = '';

    let imageUrl = null;

    try {
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `${$user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('question-images')
          .upload(path, imageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from('question-images').getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { data: inserted, error: insertErr } = await supabase
        .from('questions')
        .insert({
          title,
          description,
          category_id: categoryId || null,
          image_url: imageUrl,
          user_id: $user.id
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      goto(`/questions/${inserted.id}`);
    } catch (e) {
      error = e.message ?? 'Terjadi kesalahan, coba lagi.';
    } finally {
      loading = false;
    }
  }
</script>

<h1>Tanya pertanyaan baru</h1>

{#if !$authLoading && !$user}
  <p class="hint">Silakan <a href="/login">masuk</a> terlebih dahulu untuk bertanya.</p>
{:else if $user}
  <form on:submit|preventDefault={handleSubmit}>
    <label>
      Judul
      <input type="text" bind:value={title} maxlength="150" placeholder="Contoh: Kenapa daun monstera saya menguning?" required />
    </label>

    <label>
      Kategori
      <select bind:value={categoryId} required>
        {#each categories as cat (cat.id)}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
    </label>

    <label>
      Deskripsi
      <textarea bind:value={description} rows="6" placeholder="Jelaskan kondisi tanaman, sudah berapa lama, dan apa yang sudah dicoba…" required></textarea>
    </label>

    <label>
      Foto (opsional)
      <input type="file" accept="image/*" on:change={handleFileChange} />
    </label>

    {#if imagePreview}
      <img class="preview" src={imagePreview} alt="Pratinjau foto" />
    {/if}

    {#if error}<p class="error">{error}</p>{/if}

    <button type="submit" disabled={loading}>{loading ? 'Mengirim…' : 'Kirim pertanyaan'}</button>
  </form>
{/if}

<style>
  h1 {
    font-size: 1.6rem;
    margin-bottom: 1.25rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    max-width: 560px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.88rem;
    color: var(--ink-soft);
  }
  input,
  select,
  textarea {
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--line);
    border-radius: var(--radius-control);
    font-size: 0.95rem;
    font-family: inherit;
    background: var(--surface);
    color: var(--ink);
  }
  textarea {
    resize: vertical;
  }
  .preview {
    width: 160px;
    height: 160px;
    object-fit: cover;
    border-radius: var(--radius-control);
    border: 1px solid var(--line);
  }
  button {
    padding: 0.65rem 1.6rem;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: var(--radius-control);
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    align-self: flex-start;
  }
  button:disabled {
    opacity: 0.6;
    cursor: default;
  }
  .error {
    color: var(--danger);
    font-size: 0.85rem;
    margin: 0;
  }
  .hint {
    color: var(--ink-soft);
  }
</style>

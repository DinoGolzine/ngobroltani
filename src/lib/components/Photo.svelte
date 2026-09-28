<script>
  let { src, alt = '', cls = '' } = $props();
  let gagal = $state(false);
</script>

<div class="photo {cls}">
  {#if src}
    <img {src} {alt} loading="lazy" class:hide={gagal} onerror={() => (gagal = true)} />
  {/if}
</div>

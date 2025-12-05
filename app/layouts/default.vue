<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
});
</script>

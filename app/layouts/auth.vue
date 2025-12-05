<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-3xl font-display font-bold text-gray-900">BookHub</h1>
        </NuxtLink>
      </div>
      <slot />
    </div>
  </div>
</template>

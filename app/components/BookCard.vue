<template>
  <article class="group">
    <UCard
      class="hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      @click="navigateTo(`/books/${book.id}`)"
    >
      <div
        class="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden relative"
      >
        <NuxtImg
          :src="book.cover || '/placeholder-book.jpg'"
          :alt="`${book.title} by ${book.author}`"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          format="webp"
          quality="80"
          sizes="sm:200px md:250px lg:200px"
          placeholder
        />
        <div v-if="book.badge" class="absolute top-2 right-2">
          <UBadge :color="book.badgeColor || 'blue'" variant="solid">
            {{ book.badge }}
          </UBadge>
        </div>
      </div>

      <div class="space-y-2 flex-grow flex flex-col">
        <h3 class="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
          {{ book.title }}
        </h3>
        <p class="text-sm text-gray-600 line-clamp-1">
          {{ book.author }}
        </p>

        <div class="flex items-center justify-between mt-auto pt-2">
          <div class="flex items-center space-x-1" v-if="book.rating">
            <UIcon
              name="i-heroicons-star-solid"
              class="w-4 h-4 text-yellow-400"
              aria-hidden="true"
            />
            <span
              class="text-sm text-gray-600"
              aria-label="Rating: {{ book.rating }} out of 5"
            >
              {{ book.rating }}
            </span>
          </div>
          <span v-if="book.price" class="text-lg font-bold text-blue-600">
            ${{ Number(book.price).toFixed(2) }}
          </span>
        </div>
      </div>
    </UCard>
  </article>
</template>

<script setup lang="ts">
defineProps({
  book: {
    type: Object,
    required: true,
  },
});
</script>

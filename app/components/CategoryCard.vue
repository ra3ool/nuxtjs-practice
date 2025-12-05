<template>
  <UCard
    class="hover:shadow-lg transition-all hover:scale-105 cursor-pointer text-center"
    @click="navigateTo(`/categories/${category.id}`)"
  >
    <div class="p-6">
      <UIcon
        :name="category.icon"
        class="w-12 h-12 text-blue-600 mx-auto mb-4"
      />
      <h3 class="font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
      <p class="text-sm text-gray-600">{{ category.count }} books</p>
    </div>
  </UCard>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
});
</script>

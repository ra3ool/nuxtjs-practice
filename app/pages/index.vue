<template>
  <div>
    <!-- Hero Section -->
    <section
      class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-display font-bold mb-6">
          Discover Your Next Great Read
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
          Explore thousands of books across all genres and find your perfect
          match
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton size="lg" color="white" variant="solid" to="/books">
            Browse Books
          </UButton>
          <UButton size="lg" variant="outline" color="white" to="/categories">
            Explore Categories
          </UButton>
        </div>
      </div>
    </section>

    <!-- Featured Books -->
    <section class="py-16" aria-labelledby="featured-books-heading">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="featured-books-heading"
          class="text-3xl font-display font-bold text-center mb-12"
        >
          Featured Books
        </h2>
        <div
          v-if="loading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <USkeleton v-for="i in 4" :key="i" class="h-96" />
        </div>
        <div
          v-else-if="featuredBooks.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <BookCard v-for="book in featuredBooks" :key="book.id" :book="book" />
        </div>
        <div v-else class="text-center py-12">
          <UIcon
            name="i-heroicons-book-open"
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
          />
          <p class="text-gray-600">No featured books available</p>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="bg-gray-100 py-16" aria-labelledby="categories-heading">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="categories-heading"
          class="text-3xl font-display font-bold text-center mb-12"
        >
          Popular Categories
        </h2>
        <div
          v-if="categoriesLoading"
          class="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <USkeleton v-for="i in 4" :key="i" class="h-32" />
        </div>
        <div
          v-else-if="categories.length > 0"
          class="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <CategoryCard
            v-for="category in categories"
            :key="category.id"
            :category="category"
          />
        </div>
        <div v-else class="text-center py-12">
          <UIcon
            name="i-heroicons-folder"
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
          />
          <p class="text-gray-600">No categories available</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Home',
  description:
    'Discover, explore, and find your next favorite book with BookHub. Browse thousands of books across all genres.',
  ogTitle: 'BookHub - Discover Your Next Great Read',
  ogDescription:
    'Discover, explore, and find your next favorite book with BookHub. Browse thousands of books across all genres.',
  ogImage: '/placeholder-book.jpg',
  twitterCard: 'summary_large_image',
});

// Structured data for SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'BookHub',
          url: useRuntimeConfig().public.siteUrl,
          description:
            'Discover, explore, and find your next favorite book with BookHub.',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'BookHub',
          url: useRuntimeConfig().public.siteUrl,
          logo: `${useRuntimeConfig().public.siteUrl}/favicon.ico`,
        },
      ]),
    },
  ],
});

const { getBooks, getCategories } = useApi();

const featuredBooks = ref<any[]>([]);
const categories = ref<any[]>([]);
const loading = ref(true);
const categoriesLoading = ref(true);

onMounted(async () => {
  try {
    // Fetch featured books (you can add a featured parameter to your API)
    const books = await getBooks({ featured: true, limit: 4 });
    featuredBooks.value = books.data || books || [];
  } catch (error) {
    console.error('Failed to load featured books:', error);
    // Fallback to mock data for demo
    featuredBooks.value = [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover: '/placeholder-book.jpg',
        rating: 4.5,
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        cover: '/placeholder-book.jpg',
        rating: 4.8,
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        cover: '/placeholder-book.jpg',
        rating: 4.7,
      },
      {
        id: 4,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover: '/placeholder-book.jpg',
        rating: 4.6,
      },
    ];
  } finally {
    loading.value = false;
  }

  try {
    // Fetch categories
    const cats = await getCategories();
    categories.value = cats.data || cats || [];
  } catch (error) {
    console.error('Failed to load categories:', error);
    // Fallback to mock data for demo
    categories.value = [
      { id: 1, name: 'Fiction', icon: 'i-heroicons-book-open', count: 1250 },
      {
        id: 2,
        name: 'Mystery',
        icon: 'i-heroicons-magnifying-glass',
        count: 890,
      },
      { id: 3, name: 'Romance', icon: 'i-heroicons-heart', count: 1100 },
      { id: 4, name: 'Sci-Fi', icon: 'i-heroicons-rocket-launch', count: 750 },
    ];
  } finally {
    categoriesLoading.value = false;
  }
});
</script>

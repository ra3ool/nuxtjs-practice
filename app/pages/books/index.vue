<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
    >
      <h1 class="text-3xl font-display font-bold text-gray-900 mb-4 md:mb-0">
        All Books
      </h1>

      <div class="flex flex-col sm:flex-row gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search books..."
          icon="i-heroicons-magnifying-glass"
          class="w-full sm:w-64"
          @keyup.enter="handleSearch"
          @input="debouncedSearch"
        />
        <USelectMenu
          v-model="sortBy"
          :options="sortOptions"
          placeholder="Sort by"
        />
      </div>
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <USkeleton v-for="i in 10" :key="i" class="h-96" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-16 h-16 text-red-400 mx-auto mb-4"
      />
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <UButton @click="loadBooks">Try Again</UButton>
    </div>

    <div
      v-else-if="filteredBooks.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
    </div>

    <div v-else class="text-center py-12">
      <UIcon
        name="i-heroicons-book-open"
        class="w-16 h-16 text-gray-400 mx-auto mb-4"
      />
      <p class="text-gray-600">No books found</p>
      <UButton
        v-if="searchQuery"
        @click="clearSearch"
        variant="ghost"
        class="mt-4"
      >
        Clear search
      </UButton>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && filteredBooks.length > 0 && totalPages > 1"
      class="flex justify-center mt-8"
    >
      <UPagination
        v-model="currentPage"
        :total="totalItems"
        :page-size="pageSize"
        :max="7"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'All Books',
  description:
    'Browse our complete collection of books across all genres. Find your next great read today.',
});

const route = useRoute();
const { getBooks, searchBooks } = useApi();

const books = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref((route.query.search as string) || '');
const sortBy = ref('title');
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);

const sortOptions = [
  { label: 'Title (A-Z)', value: 'title' },
  { label: 'Author (A-Z)', value: 'author' },
  { label: 'Rating (High to Low)', value: 'rating' },
  { label: 'Price (Low to High)', value: 'price' },
  { label: 'Price (High to Low)', value: 'price_desc' },
];

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const filteredBooks = computed(() => {
  let filtered = [...books.value];

  // Client-side filtering if needed (API should handle most of this)
  if (searchQuery.value && !route.query.search) {
    filtered = filtered.filter(
      (book) =>
        book.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }

  // Client-side sorting
  return filtered.sort((a, b) => {
    if (sortBy.value === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy.value === 'price') return (a.price || 0) - (b.price || 0);
    if (sortBy.value === 'price_desc') return (b.price || 0) - (a.price || 0);
    const aVal = a[sortBy.value] || '';
    const bVal = b[sortBy.value] || '';
    return aVal.localeCompare(bVal);
  });
});

const loadBooks = async () => {
  loading.value = true;
  error.value = '';

  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      limit: pageSize.value,
      sort: sortBy.value,
    };

    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const response = await getBooks(params);

    // Handle different API response structures
    if (Array.isArray(response)) {
      books.value = response;
      totalItems.value = response.length;
    } else if (response.data) {
      books.value = response.data;
      totalItems.value = response.total || response.data.length;
    } else {
      books.value = [];
      totalItems.value = 0;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load books. Please try again.';
    console.error('Failed to load books:', err);

    // Fallback to mock data for demo
    books.value = [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover: '/placeholder-book.jpg',
        rating: 4.5,
        price: 12.99,
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        cover: '/placeholder-book.jpg',
        rating: 4.8,
        price: 14.99,
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        cover: '/placeholder-book.jpg',
        rating: 4.7,
        price: 13.99,
      },
      {
        id: 4,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover: '/placeholder-book.jpg',
        rating: 4.6,
        price: 11.99,
      },
    ];
    totalItems.value = books.value.length;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadBooks();
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  loadBooks();
};

// Debounced search
let searchTimeout: NodeJS.Timeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.length >= 3 || searchQuery.value.length === 0) {
      handleSearch();
    }
  }, 500);
};

watch([currentPage, sortBy], () => {
  loadBooks();
});

onMounted(() => {
  loadBooks();
});
</script>

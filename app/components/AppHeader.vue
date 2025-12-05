<template>
  <header class="bg-white shadow-sm border-b sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="flex items-center space-x-2"
            aria-label="BookHub Home"
          >
            <UIcon name="i-heroicons-book-open" class="w-8 h-8 text-blue-600" />
            <span class="text-2xl font-display font-bold text-gray-900"
              >BookHub</span
            >
          </NuxtLink>
        </div>

        <nav
          class="hidden md:flex items-center space-x-8"
          aria-label="Main navigation"
        >
          <NuxtLink
            to="/books"
            class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            active-class="text-blue-600"
          >
            Books
          </NuxtLink>
          <NuxtLink
            to="/categories"
            class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            active-class="text-blue-600"
          >
            Categories
          </NuxtLink>
          <NuxtLink
            to="/bestsellers"
            class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            active-class="text-blue-600"
          >
            Bestsellers
          </NuxtLink>
        </nav>

        <div class="flex items-center space-x-4">
          <UInput
            v-model="searchQuery"
            placeholder="Search books..."
            class="hidden sm:block w-64"
            icon="i-heroicons-magnifying-glass"
            @keyup.enter="handleSearch"
            aria-label="Search books"
          />

          <template v-if="isAuthenticated">
            <UDropdown
              :items="userMenuItems"
              :popper="{ placement: 'bottom-end' }"
            >
              <UButton variant="ghost" class="flex items-center space-x-2">
                <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
                <span class="hidden lg:inline">{{
                  user?.name || 'Account'
                }}</span>
              </UButton>
            </UDropdown>
          </template>

          <template v-else>
            <UButton
              to="/auth/login"
              variant="ghost"
              class="hidden sm:inline-flex"
            >
              Login
            </UButton>
            <UButton to="/auth/register" class="hidden sm:inline-flex">
              Sign Up
            </UButton>
          </template>

          <UButton
            icon="i-heroicons-bars-3"
            variant="ghost"
            class="md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="Toggle mobile menu"
          />
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t">
        <nav class="flex flex-col space-y-4">
          <NuxtLink
            to="/books"
            class="text-gray-700 hover:text-blue-600 transition-colors"
            @click="mobileMenuOpen = false"
          >
            Books
          </NuxtLink>
          <NuxtLink
            to="/categories"
            class="text-gray-700 hover:text-blue-600 transition-colors"
            @click="mobileMenuOpen = false"
          >
            Categories
          </NuxtLink>
          <NuxtLink
            to="/bestsellers"
            class="text-gray-700 hover:text-blue-600 transition-colors"
            @click="mobileMenuOpen = false"
          >
            Bestsellers
          </NuxtLink>
          <template v-if="!isAuthenticated">
            <UButton
              to="/auth/login"
              variant="ghost"
              block
              @click="mobileMenuOpen = false"
            >
              Login
            </UButton>
            <UButton to="/auth/register" block @click="mobileMenuOpen = false">
              Sign Up
            </UButton>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth();
const searchQuery = ref('');
const mobileMenuOpen = ref(false);

const userMenuItems = computed(() => [
  [
    {
      label: 'My Profile',
      icon: 'i-heroicons-user',
      to: '/profile',
    },
    {
      label: 'My Books',
      icon: 'i-heroicons-book-open',
      to: '/my-books',
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: async () => {
        await logout();
      },
    },
  ],
]);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/books?search=${encodeURIComponent(searchQuery.value)}`);
    searchQuery.value = '';
  }
};
</script>

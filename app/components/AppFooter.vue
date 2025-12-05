<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <UIcon name="i-heroicons-book-open" class="w-8 h-8 text-blue-400" />
            <span class="text-2xl font-display font-bold">BookHub</span>
          </div>
          <p class="text-gray-400 mb-4">
            Discover your next great read with our curated collection of books
            across all genres.
          </p>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2 text-gray-400">
            <li>
              <NuxtLink to="/books" class="hover:text-white transition-colors"
                >Browse Books</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/categories"
                class="hover:text-white transition-colors"
                >Categories</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/bestsellers"
                class="hover:text-white transition-colors"
                >Bestsellers</NuxtLink
              >
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Support</h3>
          <ul class="space-y-2 text-gray-400">
            <li>
              <NuxtLink to="/contact" class="hover:text-white transition-colors"
                >Contact</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/privacy" class="hover:text-white transition-colors"
                >Privacy</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/terms" class="hover:text-white transition-colors"
                >Terms</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 BookHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

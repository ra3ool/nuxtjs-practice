// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxtjs/google-fonts', '@nuxt/image'],

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'Playfair Display': [400, 700],
    },
    display: 'swap',
    preload: true,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'BookHub - Discover Your Next Great Read',
      titleTemplate: '%s - BookHub',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content:
            'Discover, explore, and find your next favorite book with BookHub. Browse thousands of books across all genres.',
        },
        {
          name: 'keywords',
          content:
            'books, reading, literature, novels, fiction, non-fiction, bestsellers, book reviews, book recommendations',
        },
        { name: 'author', content: 'BookHub' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'BookHub' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#2563eb' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://api.example.com',
      siteUrl: process.env.SITE_URL || 'https://bookhub.com',
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  experimental: {
    payloadExtraction: false,
  },
});

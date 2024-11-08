// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
  ],

  pwa: {
    manifest: {
      name: 'voisin',
      short_name: 'voisin',
      lang: 'fr',
      start_url: '/',
      display: 'standalone',
      background_color: '#FFFFFF',
      theme_color: '#FFFFFF',
      icons: [
        {
          src: '/images/logo.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/images/nat.jpg',
          sizes: '192x192',
          type: 'image/jpg'
        }
      ]
    }
  },

  compatibilityDate: '2024-11-08'
});
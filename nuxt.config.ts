// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css'
  ],
  modules: [
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'pinia-plugin-persistedstate/nuxt',
    '@pinia-orm/nuxt'

  ],
  plugins: [
    '~/plugins/bootstrap.js',
    '~/plugins/initAuth.client.js',
    '~/plugins/websocket.client.js',
    '~/plugins/messagesWebSocket.client.js'
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
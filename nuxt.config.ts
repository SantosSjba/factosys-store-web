// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  // Valores por defecto; Nuxt los sobreescribe con NUXT_PUBLIC_* del .env
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:3000/api',
      appName: 'Factosys Store',
    },
  },

  devServer: {
    port: 3001,
  },

  app: {
    head: {
      title: 'Factosys Store',
      meta: [
        { name: 'description', content: 'Tienda en línea Factosys' },
      ],
    },
  },
})

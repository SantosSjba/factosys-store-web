// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  // mutations/ y queries/ no se escanean por defecto (solo composables raíz)
  imports: {
    dirs: ['composables/mutations', 'composables/queries'],
  },

  css: ['~/assets/css/main.css'],

  // AuthCard, UiButton, AppHeader… sin prefijo Layout*/Ui*
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  // Dev: /api/* → backend conservando el prefijo /api (Nest global prefix)
  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.NUXT_API_PROXY_TARGET || 'http://127.0.0.1:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',
      apiOrigin: process.env.NUXT_API_PROXY_TARGET || 'http://127.0.0.1:3000',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Factosys Store',
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

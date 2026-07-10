// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

function patchVeeValidateDevtools(code: string) {
  return code.replace(
    /async function installDevtoolsPlugin\(app\)\s*\{/,
    'async function installDevtoolsPlugin(app) { return;',
  )
}

/** Evita que vee-validate cargue @vue/devtools-api (rompe con Nuxt DevTools / Safari). */
function stubVueDevtoolsApi() {
  const virtualId = '\0virtual:vue-devtools-api-stub'

  return {
    name: 'stub-vue-devtools-api',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (id === '@vue/devtools-api') return virtualId
    },
    load(id: string) {
      if (id !== virtualId) return

      return [
        'export function setupDevtoolsPlugin() {}',
        'export function setupDevToolsPlugin() {}',
        'export function addCustomCommand() {}',
        'export function addCustomTab() {}',
        'export function onDevToolsClientConnected() {}',
        'export function onDevToolsConnected() {}',
        'export function removeCustomCommand() {}',
      ].join('\n')
    },
  }
}

/** Anula installDevtoolsPlugin en el bundle de vee-validate (el import dinámico sigue fallando en dev). */
function noopVeeValidateDevtools() {
  return {
    name: 'noop-vee-validate-devtools',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (!id.includes('vee-validate') || !code.includes('installDevtoolsPlugin')) {
        return
      }

      const patched = patchVeeValidateDevtools(code)
      if (patched === code) return
      return { code: patched, map: null }
    },
  }
}

const apiProxyTarget =
  process.env.NUXT_API_PROXY_TARGET || 'https://127.0.0.1:3000'

const apiProxyOrigin = apiProxyTarget.replace(/\/$/, '')
const publicApiOrigin =
  process.env.NUXT_PUBLIC_API_ORIGIN || apiProxyOrigin

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/image', '@vueuse/nuxt'],

  // Dev: devProxy. Producción: server/routes/api/[...].ts reenvía /api/* al backend.
  nitro: {
    devProxy: {
      '/api': {
        target: apiProxyOrigin,
        changeOrigin: true,
        secure: false,
        timeout: 120_000,
        proxyTimeout: 120_000,
      },
    },
  },

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
    plugins: [stubVueDevtoolsApi(), noopVeeValidateDevtools()],
    optimizeDeps: {
      include: [
        '@iconify/vue',
        '@mercadopago/sdk-js',
        '@tanstack/vue-query',
        '@vee-validate/zod',
        'axios',
        'filepond-plugin-file-validate-size',
        'filepond-plugin-file-validate-type',
        'filepond-plugin-image-preview',
        'vee-validate',
        'vue-draggable-plus',
        'vue-filepond',
        'zod',
      ],
      exclude: ['@vue/devtools-api'],
      esbuildOptions: {
        plugins: [
          {
            name: 'noop-vee-validate-devtools-esbuild',
            setup(build) {
              build.onLoad({ filter: /vee-validate.*\.mjs$/ }, (args) => {
                if (!args.path.includes('vee-validate')) return
                const contents = readFileSync(args.path, 'utf8')
                if (!contents.includes('installDevtoolsPlugin')) return
                return {
                  contents: patchVeeValidateDevtools(contents),
                  loader: 'js',
                }
              })
            },
          },
        ],
      },
    },
    resolve: {
      alias: {
        '@vue/devtools-api': fileURLToPath(
          new URL('./app/utils/devtools-api-stub.ts', import.meta.url),
        ),
      },
    },
    server: {
      // La API usa 3000; no permitir que Vite caiga en 3000 si 3001 está ocupado.
      strictPort: true,
      proxy: {
        '/api': {
          target: apiProxyOrigin,
          changeOrigin: true,
          secure: false,
          timeout: 120_000,
          proxyTimeout: 120_000,
        },
      },
    },
  },

  runtimeConfig: {
    /** URL del backend Nest (sin /api). Coolify: NUXT_API_PROXY_TARGET en runtime. */
    apiProxyTarget: apiProxyOrigin,
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',
      apiOrigin: publicApiOrigin,
      apiTimeoutMs: Number(process.env.NUXT_PUBLIC_API_TIMEOUT_MS || 120_000),
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Factosys Store',
    },
  },

  devServer: {
    port: 3001,
  },

  image: {
    quality: 80,
    format: ['webp'],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Factosys Store',
      meta: [
        { name: 'description', content: 'Tienda en línea Factosys' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0096b4' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Factosys Store' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/brand/logo-factosys.png' },
      ],
      script: [
        {
          key: 'theme-init',
          innerHTML:
            "(function(){try{var t=localStorage.getItem('fs-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}})();",
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
    },
  },
})

import { createError, proxyRequest } from 'h3'

/**
 * Producción: reenvía /api/* (p. ej. /api/media/*) al backend Nest.
 * En dev, Vite devProxy ya hace esto; esta ruta cubre el servidor Nitro en prod.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const origin = String(config.apiProxyTarget || config.public.apiOrigin || '')
    .replace(/\/$/, '')

  if (!origin) {
    throw createError({
      statusCode: 502,
      statusMessage: 'NUXT_API_PROXY_TARGET no configurado',
    })
  }

  const path = event.path.startsWith('/') ? event.path : `/${event.path}`

  return proxyRequest(event, `${origin}${path}`)
})

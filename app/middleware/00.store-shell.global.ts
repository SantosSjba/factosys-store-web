export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/intranet')) return
  await useStoreShellPrefetch()
})

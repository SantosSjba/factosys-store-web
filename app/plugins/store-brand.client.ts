export default defineNuxtPlugin({
  name: 'store-brand',
  dependsOn: ['vue-query'],
  setup() {
    const { data: settings } = useStoreSettingsQuery()

    watch(
      () => settings.value?.faviconUrl,
      (faviconUrl) => {
        if (!faviconUrl) return

        let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        link.href = faviconUrl
      },
      { immediate: true },
    )
  },
})

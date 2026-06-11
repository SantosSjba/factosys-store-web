type StoreSeoOptions = {
  title?: string
  description?: string
  image?: string | null
  noindex?: boolean
}

export function useStoreSeo(options: MaybeRefOrGetter<StoreSeoOptions> = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const requestURL = useRequestURL()
  const { data: settings } = useStoreSettingsQuery()

  const storeName = computed(
    () => settings.value?.storeName ?? config.public.appName,
  )

  const resolved = computed(() => toValue(options))

  const pageTitle = computed(() => {
    const custom = resolved.value.title?.trim()
    if (!custom) return storeName.value
    return `${custom} | ${storeName.value}`
  })

  const pageDescription = computed(() => {
    const custom = resolved.value.description?.trim()
    if (custom) return custom
    return (
      settings.value?.storeTagline?.trim() ||
      `Compra tecnología y más en ${storeName.value}. Envíos a todo el Perú.`
    )
  })

  const ogImage = computed(
    () => resolved.value.image || settings.value?.logoUrl || undefined,
  )

  useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogImage,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    robots: computed(() =>
      resolved.value.noindex ? 'noindex, nofollow' : 'index, follow',
    ),
  })

  useHead({
    link: computed(() => [
      {
        rel: 'canonical',
        href: `${requestURL.origin}${route.path}`,
      },
    ]),
  })
}

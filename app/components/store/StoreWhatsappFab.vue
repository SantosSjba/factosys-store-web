<script setup lang="ts">
const route = useRoute()
const { data: settings } = useStoreSettingsQuery()

const whatsappUrl = computed(() => {
  const raw = settings.value?.company.whatsapp
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  if (!digits) return null
  const text = encodeURIComponent(
    `Hola, quiero información sobre productos en ${settings.value?.storeName ?? 'la tienda'}.`,
  )
  return `https://wa.me/${digits}?text=${text}`
})

const isStoreRoute = computed(() => !route.path.startsWith('/intranet'))
</script>

<template>
  <a
    v-if="whatsappUrl && isStoreRoute"
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl md:bottom-6"
    aria-label="Contactar por WhatsApp"
  >
    <UiIcon name="lucide:message-circle" :size="28" />
  </a>
</template>

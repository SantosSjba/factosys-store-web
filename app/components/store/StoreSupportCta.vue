<script setup lang="ts">
const { data: settings } = useStoreSettingsQuery()

const items = computed(() => {
  const company = settings.value?.company
  if (!company) return []

  const list: Array<{
    icon: string
    title: string
    description: string
    href?: string
    external?: boolean
  }> = []

  if (company.whatsapp) {
    const digits = company.whatsapp.replace(/\D/g, '')
    list.push({
      icon: 'lucide:message-circle',
      title: 'WhatsApp',
      description: 'Escríbenos y te ayudamos con tu compra',
      href: `https://wa.me/${digits}`,
      external: true,
    })
  }

  if (company.supportPhone) {
    list.push({
      icon: 'lucide:phone',
      title: 'Teléfono',
      description: company.supportPhone,
      href: `tel:${company.supportPhone.replace(/\s/g, '')}`,
    })
  }

  if (company.supportEmail) {
    list.push({
      icon: 'lucide:mail',
      title: 'Correo',
      description: company.supportEmail,
      href: `mailto:${company.supportEmail}`,
    })
  }

  return list
})
</script>

<template>
  <section
    v-if="items.length > 0"
    class="bg-theme-muted/80"
  >
    <StoreHomeSection
      title="¿Necesitas ayuda?"
      description="Nuestro equipo está listo para asistirte"
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <component
          :is="item.href ? 'a' : 'div'"
          v-for="item in items"
          :key="item.title"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          class="border-theme bg-theme-surface flex items-start gap-4 rounded-xl border p-4 shadow-sm transition hover:shadow-md"
          :class="item.href && 'hover:border-[var(--brand-cyan)]'"
        >
          <div
            class="bg-brand-accent-soft text-brand-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          >
            <UiIcon :name="item.icon" :size="22" />
          </div>
          <div class="min-w-0">
            <p class="text-theme font-semibold">{{ item.title }}</p>
            <p class="text-theme-muted mt-0.5 break-all text-sm">
              {{ item.description }}
            </p>
          </div>
        </component>
      </div>
    </StoreHomeSection>
  </section>
</template>

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

const policyLinks = computed(() => {
  const settingsValue = settings.value
  if (!settingsValue) return []

  return [
    { label: 'Política de devoluciones', href: settingsValue.returnsPolicyUrl },
    { label: 'Política de garantía', href: settingsValue.warrantyPolicyUrl },
    { label: 'Términos y condiciones', href: settingsValue.termsUrl },
    { label: 'Libro de reclamaciones', href: settingsValue.complaintsBookUrl },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href))
})
</script>

<template>
  <section class="space-y-5">
    <div>
      <h3 class="text-theme text-lg font-bold sm:text-xl">Ayuda</h3>
      <p class="text-theme-muted mt-1 text-sm">
        Contáctanos si necesitas asistencia con un pedido o tu cuenta.
      </p>
    </div>

    <div
      v-if="items.length > 0"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
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

    <div
      v-else
      class="border-theme bg-theme-surface rounded-2xl border p-6 text-center shadow-sm"
    >
      <p class="text-theme-muted text-sm">
        Pronto habilitaremos más canales de soporte.
      </p>
    </div>

    <div
      v-if="policyLinks.length > 0"
      class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm"
    >
      <p class="text-theme text-sm font-semibold">Información útil</p>
      <ul class="mt-3 space-y-2">
        <li v-for="link in policyLinks" :key="link.label">
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="text-brand-accent-deep text-sm font-medium hover:underline"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

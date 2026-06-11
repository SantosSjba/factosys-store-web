<script setup lang="ts">
const { data: settings } = useStoreSettingsQuery()

const storeName = computed(
  () => settings.value?.storeName ?? 'Factosys Store',
)

const companyName = computed(
  () => settings.value?.company.tradeName || storeName.value,
)

const year = new Date().getFullYear()

const shopLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/productos' },
  { label: 'Mis favoritos', to: '/favoritos' },
  { label: 'Mi cuenta', to: '/cuenta' },
]

const legalLinks = computed(() => {
  const links: Array<{ label: string; href: string; external: boolean }> = []
  const s = settings.value
  if (s?.termsUrl) links.push({ label: 'Términos y condiciones', href: s.termsUrl, external: true })
  if (s?.privacyPolicyUrl) links.push({ label: 'Política de privacidad', href: s.privacyPolicyUrl, external: true })
  if (s?.returnsPolicyUrl) links.push({ label: 'Cambios y devoluciones', href: s.returnsPolicyUrl, external: true })
  if (s?.warrantyPolicyUrl) links.push({ label: 'Garantía', href: s.warrantyPolicyUrl, external: true })
  if (s?.complaintsBookUrl) links.push({ label: 'Libro de reclamaciones', href: s.complaintsBookUrl, external: true })
  return links
})

const contactItems = computed(() => {
  const company = settings.value?.company
  if (!company) return []
  const items: Array<{ icon: string; label: string; href?: string }> = []
  if (company.supportEmail) {
    items.push({
      icon: 'lucide:mail',
      label: company.supportEmail,
      href: `mailto:${company.supportEmail}`,
    })
  }
  if (company.supportPhone) {
    items.push({
      icon: 'lucide:phone',
      label: company.supportPhone,
      href: `tel:${company.supportPhone.replace(/\s/g, '')}`,
    })
  }
  if (company.whatsapp) {
    const digits = company.whatsapp.replace(/\D/g, '')
    items.push({
      icon: 'lucide:message-circle',
      label: company.whatsapp,
      href: `https://wa.me/${digits}`,
    })
  }
  return items
})
</script>

<template>
  <footer
    role="contentinfo"
    class="border-theme bg-theme-muted text-theme-muted border-t"
  >
    <div class="mx-auto max-w-7xl px-4 py-10 sm:py-12">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div class="sm:col-span-2 lg:col-span-1">
          <BrandLogo size="sm" />
          <p
            v-if="settings?.storeTagline"
            class="mt-3 max-w-xs text-sm leading-relaxed"
          >
            {{ settings.storeTagline }}
          </p>
        </div>

        <div>
          <h2 class="text-theme text-sm font-semibold uppercase tracking-wide">
            Tienda
          </h2>
          <ul class="mt-4 space-y-2 text-sm">
            <li v-for="link in shopLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="hover:text-theme transition"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="legalLinks.length > 0">
          <h2 class="text-theme text-sm font-semibold uppercase tracking-wide">
            Legal
          </h2>
          <ul class="mt-4 space-y-2 text-sm">
            <li v-for="link in legalLinks" :key="link.href">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-theme transition"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <div v-if="contactItems.length > 0">
          <h2 class="text-theme text-sm font-semibold uppercase tracking-wide">
            Contacto
          </h2>
          <ul class="mt-4 space-y-3 text-sm">
            <li
              v-for="item in contactItems"
              :key="item.label"
              class="flex items-center gap-2"
            >
              <UiIcon :name="item.icon" :size="16" class="shrink-0" />
              <a
                v-if="item.href"
                :href="item.href"
                class="hover:text-theme break-all transition"
                :target="item.href.startsWith('http') ? '_blank' : undefined"
                :rel="item.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              >
                {{ item.label }}
              </a>
              <span v-else>{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-theme text-theme-muted mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-center text-xs sm:flex-row sm:text-left"
      >
        <p>© {{ year }} {{ companyName }}. Todos los derechos reservados.</p>
        <p class="text-theme-muted/80">
          Hecho con tecnología Factosys
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { data: settings, refetch, isFetching } = useStoreSettingsQuery()

const storeName = computed(
  () => settings.value?.storeName ?? 'Factosys Store',
)

const contactEmail = computed(() => settings.value?.company.supportEmail)
const contactPhone = computed(() => settings.value?.company.supportPhone)

useStoreSeo({
  title: 'Mantenimiento',
  noindex: true,
})

async function checkAgain() {
  await refetch()
  if (!settings.value?.maintenanceMode) {
    await navigateTo('/')
  }
}
</script>

<template>
  <div class="bg-theme-muted flex min-h-screen items-center justify-center px-4 py-8">
    <div class="border-theme bg-theme-surface w-full max-w-lg rounded-2xl border p-6 text-center shadow-sm sm:p-8">
      <div v-if="settings?.logoUrl" class="flex justify-center">
        <BrandLogo to="/" size="sm" />
      </div>
      <UiIcon
        v-else
        name="lucide:construction"
        :size="48"
        class="text-brand-accent mx-auto"
      />

      <h1 class="text-theme mt-4 text-xl font-bold sm:text-2xl">
        {{ storeName }} en mantenimiento
      </h1>
      <p class="text-theme-muted mt-3 text-sm leading-relaxed">
        {{
          settings?.maintenanceMessage ??
            'Estamos realizando mejoras. Vuelve a intentarlo en unos minutos.'
        }}
      </p>

      <div
        v-if="contactEmail || contactPhone"
        class="text-theme-muted mt-4 space-y-1 text-sm"
      >
        <p v-if="contactEmail">
          <a :href="`mailto:${contactEmail}`" class="text-brand-accent-deep hover:underline">
            {{ contactEmail }}
          </a>
        </p>
        <p v-if="contactPhone">
          <a
            :href="`tel:${contactPhone.replace(/\s/g, '')}`"
            class="text-brand-accent-deep hover:underline"
          >
            {{ contactPhone }}
          </a>
        </p>
      </div>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <UiButton icon="lucide:refresh-cw" :loading="isFetching" @click="checkAgain">
          Reintentar
        </UiButton>
        <NuxtLink to="/intranet">
          <UiButton variant="secondary" icon="lucide:shield" class="w-full sm:w-auto">
            Acceso intranet
          </UiButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: settings } = useStoreSettingsQuery()

const {
  canPromptInstall,
  showIosGuide,
  isVisible,
  isInstalling,
  install,
  dismiss,
} = usePwaInstall()

const storeName = computed(
  () => settings.value?.storeName ?? 'Factosys Store',
)

const isStoreRoute = computed(() => !route.path.startsWith('/intranet'))
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-4 opacity-0"
  >
    <aside
      v-if="isVisible && isStoreRoute"
      class="border-theme bg-theme-surface fixed inset-x-3 z-50 rounded-2xl border p-4 shadow-xl sm:inset-x-auto sm:right-4 sm:max-w-sm md:bottom-6"
      :class="showIosGuide || canPromptInstall ? 'bottom-24 md:bottom-6' : 'bottom-6'"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <div class="flex items-start gap-3">
        <div
          class="bg-brand-accent-soft text-brand-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        >
          <UiIcon name="lucide:smartphone" :size="22" />
        </div>

        <div class="min-w-0 flex-1">
          <p id="pwa-install-title" class="text-theme text-sm font-semibold">
            Instala {{ storeName }}
          </p>
          <p
            id="pwa-install-description"
            class="text-theme-muted mt-1 text-xs leading-relaxed sm:text-sm"
          >
            <template v-if="showIosGuide">
              En Safari, toca
              <UiIcon name="lucide:share" :size="14" class="mx-0.5 inline align-text-bottom" />
              <strong>Compartir</strong>
              y luego
              <strong>Añadir a pantalla de inicio</strong>
              para abrirla como app.
            </template>
            <template v-else>
              Accede más rápido desde tu teléfono, como si fuera una app nativa.
            </template>
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <UiButton
              v-if="canPromptInstall"
              class="!px-3 !py-2 text-xs"
              icon="lucide:download"
              :loading="isInstalling"
              @click="install"
            >
              Instalar
            </UiButton>
            <button
              type="button"
              class="text-theme-muted hover:text-theme text-xs font-medium sm:text-sm"
              @click="dismiss"
            >
              Ahora no
            </button>
          </div>
        </div>

        <button
          type="button"
          class="text-theme-muted hover:text-theme shrink-0 rounded-lg p-1"
          aria-label="Cerrar aviso de instalación"
          @click="dismiss"
        >
          <UiIcon name="lucide:x" :size="18" />
        </button>
      </div>
    </aside>
  </Transition>
</template>

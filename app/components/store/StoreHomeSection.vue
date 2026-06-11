<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  description?: string
  actionLabel?: string
  actionTo?: RouteLocationRaw
  muted?: boolean
  flash?: boolean
  sectionId?: string
}>()
</script>

<template>
  <section
    :id="sectionId"
    class="scroll-mt-24"
    :class="
      flash
        ? 'border-theme bg-theme-muted/70 border-y border-t-[3px] border-t-[var(--brand-cyan)]'
        : muted
          ? 'bg-theme-muted/60'
          : ''
    "
  >
    <div
      class="mx-auto max-w-7xl px-4 py-8 sm:py-10"
      :class="flash && 'py-6 sm:py-8'"
    >
      <div class="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
          <div
            v-if="flash"
            class="bg-brand-accent-soft text-brand-accent-deep mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
          >
            <UiIcon name="lucide:zap" :size="14" />
            Ofertas del día
          </div>
          <h2 class="text-theme text-xl font-bold tracking-tight sm:text-2xl">
            {{ title }}
          </h2>
          <p
            v-if="description"
            class="text-theme-muted mt-1 text-sm sm:text-base"
          >
            {{ description }}
          </p>
        </div>
        <NuxtLink
          v-if="actionLabel && actionTo"
          :to="actionTo"
          class="text-brand-accent-deep shrink-0 text-sm font-semibold hover:underline"
        >
          {{ actionLabel }} →
        </NuxtLink>
      </div>
      <slot />
    </div>
  </section>
</template>

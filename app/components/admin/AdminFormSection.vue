<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon: string
}>()
</script>

<template>
  <section class="border-admin-line overflow-hidden rounded-xl border bg-admin-surface/30">
    <div
      class="border-admin-line flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3.5 sm:px-5"
    >
      <div class="flex min-w-0 items-start gap-3">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style="background: var(--admin-primary-soft); color: var(--admin-primary)"
        >
          <UiIcon :name="icon" :size="18" />
        </div>
        <div class="min-w-0">
          <h3 class="text-admin text-sm font-semibold">{{ title }}</h3>
          <p v-if="description" class="text-admin-muted mt-0.5 text-xs leading-relaxed">
            {{ description }}
          </p>
        </div>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <div class="p-4 sm:p-5">
      <slot />
    </div>
  </section>
</template>

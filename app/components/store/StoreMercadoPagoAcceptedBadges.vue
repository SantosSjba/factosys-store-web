<script setup lang="ts">
const props = defineProps<{
  methods: Array<{
    id: string
    name: string
    thumbnail: string | null
  }>
}>()

const hasMethods = computed(() => props.methods.length > 0)
</script>

<template>
  <div v-if="hasMethods" class="space-y-2">
    <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
      Medios aceptados con Mercado Pago
    </p>
    <div class="flex flex-wrap items-center gap-2">
      <div
        v-for="method in methods"
        :key="method.id"
        class="border-theme bg-theme-surface flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
      >
        <img
          v-if="method.thumbnail"
          :src="method.thumbnail"
          :alt="method.name"
          class="h-5 w-auto max-w-[4.5rem] object-contain"
          loading="lazy"
        >
        <span v-else class="text-theme text-xs font-medium">{{ method.name }}</span>
      </div>
    </div>
  </div>
</template>

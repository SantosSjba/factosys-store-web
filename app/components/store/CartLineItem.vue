<script setup lang="ts">
defineProps<{
  title: string
  price: number
  quantity: number
  imageUrl?: string
}>()

const emit = defineEmits<{
  'update:quantity': [value: number]
  remove: []
}>()
</script>

<template>
  <div class="border-theme flex gap-3 border-b py-4 last:border-b-0">
    <div class="bg-theme-muted h-16 w-16 shrink-0 overflow-hidden rounded-lg">
      <img v-if="imageUrl" :src="imageUrl" :alt="title" class="h-full w-full object-cover" />
      <div v-else class="text-theme-muted flex h-full items-center justify-center">
        <UiIcon name="lucide:image" :size="20" />
      </div>
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-theme line-clamp-2 text-sm font-medium">{{ title }}</p>
      <UiPrice :price="price" class="mt-1" />
      <div class="mt-2 flex items-center justify-between gap-2">
        <UiQuantityStepper
          :model-value="quantity"
          @update:model-value="emit('update:quantity', $event)"
        />
        <button
          type="button"
          class="text-theme-muted text-xs hover:text-red-500"
          @click="emit('remove')"
        >
          Quitar
        </button>
      </div>
    </div>
  </div>
</template>

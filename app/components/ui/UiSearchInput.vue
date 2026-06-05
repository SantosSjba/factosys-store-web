<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()
</script>

<template>
  <div
    class="border-brand-cyan-focus border-store-line bg-theme-surface flex w-full items-center overflow-hidden rounded-full border shadow-sm"
  >
    <input
      :value="modelValue"
      type="search"
      class="text-theme placeholder:text-theme-muted min-w-0 flex-1 border-0 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-0"
      :placeholder="placeholder"
      autocomplete="off"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter.prevent="emit('submit')"
    />
    <UiIconButton
      type="submit"
      icon="lucide:search"
      ariaLabel="Buscar"
      variant="ghost"
      size="sm"
      class="text-brand-accent mr-1 shrink-0"
    />
  </div>
</template>

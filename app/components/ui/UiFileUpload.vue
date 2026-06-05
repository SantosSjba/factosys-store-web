<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: File | null
    label: string
    accept?: string
    hint?: string
  }>(),
  { accept: 'image/*' },
)

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function onChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  emit('update:modelValue', file)
}

function openPicker() {
  inputRef.value?.click()
}

function clear() {
  emit('update:modelValue', null)
  if (inputRef.value) inputRef.value.value = ''
}
</script>

<template>
  <div class="space-y-1.5">
    <span class="text-theme text-sm font-medium">{{ label }}</span>
    <div
      class="border-store-line bg-theme-surface hover:border-brand-accent flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition"
      @click="openPicker"
    >
      <UiIcon name="lucide:upload-cloud" :size="28" class="text-theme-muted mb-2" />
      <p class="text-theme text-sm font-medium">
        {{ modelValue ? modelValue.name : 'Haz clic para seleccionar archivo' }}
      </p>
      <p v-if="hint && !modelValue" class="text-theme-muted mt-1 text-xs">{{ hint }}</p>
    </div>
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      @change="onChange"
    />
    <button
      v-if="modelValue"
      type="button"
      class="text-theme-muted text-xs hover:text-theme"
      @click.stop="clear"
    >
      Quitar archivo
    </button>
  </div>
</template>

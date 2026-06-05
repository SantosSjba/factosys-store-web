<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label: string
  hint?: string
  error?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const id = `switch-${useId()}`
</script>

<template>
  <div class="space-y-1">
    <label
      class="flex items-center justify-between gap-3"
      :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
      :for="id"
    >
      <span class="text-theme text-sm font-medium">{{ label }}</span>
      <button
        :id="id"
        type="button"
        role="switch"
        class="relative h-6 w-11 shrink-0 rounded-full transition"
        :class="[
          modelValue ? 'bg-brand-accent' : 'bg-theme-muted',
          error && 'ring-2 ring-red-500/40',
        ]"
        :aria-checked="modelValue"
        :disabled="disabled"
        @click="emit('update:modelValue', !modelValue)"
      >
        <span
          class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
          :class="modelValue ? 'left-[1.35rem]' : 'left-0.5'"
        />
      </button>
    </label>
    <UiFieldMessage :error="error" :hint="hint" />
  </div>
</template>

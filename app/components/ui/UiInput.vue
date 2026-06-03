<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  type?: string
  autocomplete?: string
  required?: boolean
  hint?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="block space-y-1.5">
    <span class="text-sm font-medium text-slate-700">{{ label }}</span>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :autocomplete="autocomplete"
      :required="required"
      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <span v-if="hint" class="text-xs text-slate-500">{{ hint }}</span>
  </label>
</template>

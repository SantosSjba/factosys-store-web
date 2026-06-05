<script setup lang="ts">
import type { ToastItem } from '~/types/ui'

const props = defineProps<{
  toast: ToastItem
}>()

const emit = defineEmits<{
  close: [id: string]
}>()

const iconByVariant = {
  success: 'lucide:circle-check',
  error: 'lucide:circle-x',
  warning: 'lucide:triangle-alert',
  info: 'lucide:info',
} as const
</script>

<template>
  <div
    class="toast-item pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg"
    :class="`toast-item--${toast.variant}`"
    role="status"
  >
    <UiIcon
      :name="iconByVariant[toast.variant]"
      :size="18"
      class="toast-item__icon mt-0.5 shrink-0"
    />
    <p class="toast-item__message flex-1 text-sm font-medium">{{ toast.message }}</p>
    <button
      type="button"
      class="toast-item__close shrink-0 rounded-md p-1 opacity-70 transition hover:opacity-100"
      aria-label="Cerrar notificación"
      @click="emit('close', props.toast.id)"
    >
      <UiIcon name="lucide:x" :size="14" />
    </button>
  </div>
</template>

<style scoped>
.toast-item {
  background: var(--admin-card);
  border-color: var(--admin-border);
}

.toast-item__message {
  color: var(--admin-text);
}

.toast-item__close {
  color: var(--admin-text-muted);
}

.toast-item--success .toast-item__icon {
  color: var(--admin-success);
}

.toast-item--error .toast-item__icon {
  color: var(--admin-danger);
}

.toast-item--warning .toast-item__icon {
  color: #f59e0b;
}

.toast-item--info .toast-item__icon {
  color: var(--admin-primary);
}
</style>

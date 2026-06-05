<script setup lang="ts">
const props = defineProps<{
  label: string
  show?: boolean
  placement?: 'right' | 'top'
}>()

const triggerRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const tooltipStyle = ref<Record<string, string>>({})

function updatePosition() {
  const el = triggerRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()

  if (props.placement === 'top') {
    tooltipStyle.value = {
      top: `${rect.top - 8}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: 'translate(-50%, -100%)',
    }
    return
  }

  tooltipStyle.value = {
    top: `${rect.top + rect.height / 2}px`,
    left: `${rect.right + 10}px`,
    transform: 'translateY(-50%)',
  }
}

function showTooltip() {
  if (!props.show) return
  visible.value = true
  updatePosition()
}

function hideTooltip() {
  visible.value = false
}
</script>

<template>
  <div
    ref="triggerRef"
    class="inline-flex w-full"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focusin="showTooltip"
    @focusout="hideTooltip"
  >
    <slot />
  </div>

  <Teleport to="body">
    <span
      v-if="show && visible"
      role="tooltip"
      class="pointer-events-none fixed z-[9999] whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-lg"
      :style="{ ...tooltipStyle, background: 'var(--tooltip-bg)', color: 'var(--tooltip-text)' }"
    >
      {{ label }}
    </span>
  </Teleport>
</template>

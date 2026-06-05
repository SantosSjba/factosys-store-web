<script setup lang="ts">
const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function onDocumentClick(e: MouseEvent) {
  if (!rootRef.value?.contains(e.target as Node)) close()
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="rootRef" class="relative inline-block">
    <div @click.stop="toggle">
      <slot name="trigger" :open="open" />
    </div>
    <div
      v-if="open"
      class="border-theme bg-theme-dropdown absolute right-0 top-full z-50 mt-1 min-w-[10rem] overflow-hidden rounded-lg border py-1 shadow-lg"
      @click="close"
    >
      <slot />
    </div>
  </div>
</template>

/**
 * Distingue un clic real de un arrastre (scroll horizontal, etc.).
 * En Windows/Edge el scroll suele cancelar la navegación del enlace.
 */
export function usePointerClickIntent(threshold = 8) {
  const pointerStart = ref<{ x: number; y: number } | null>(null)
  const dragged = ref(false)

  function onPointerDown(event: PointerEvent) {
    pointerStart.value = { x: event.clientX, y: event.clientY }
    dragged.value = false
  }

  function onPointerMove(event: PointerEvent) {
    if (!pointerStart.value || dragged.value) return

    const dx = Math.abs(event.clientX - pointerStart.value.x)
    const dy = Math.abs(event.clientY - pointerStart.value.y)

    if (dx > threshold || dy > threshold) {
      dragged.value = true
    }
  }

  function onPointerUp() {
    pointerStart.value = null
  }

  function shouldFollowClick() {
    return !dragged.value
  }

  function resetDrag() {
    dragged.value = false
    pointerStart.value = null
  }

  function onClickCapture(event: MouseEvent) {
    if (!shouldFollowClick()) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    resetDrag()
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onClickCapture,
    resetDrag,
  }
}

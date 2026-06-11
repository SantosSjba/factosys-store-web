<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variantId: string | null
    quantity?: number
    size?: 'md' | 'lg'
    class?: string
  }>(),
  {
    quantity: 1,
    size: 'lg',
  },
)

const { addToCart, isAdding } = useStoreCart()

async function onClick() {
  if (!props.variantId) return
  await addToCart(props.variantId, props.quantity)
}
</script>

<template>
  <UiButton
    icon="lucide:shopping-cart"
    :loading="isAdding"
    :disabled="!variantId"
    :class="[size === 'lg' && 'sm:min-w-[12rem]', props.class]"
    @click="onClick"
  >
    Agregar al carrito
  </UiButton>
</template>

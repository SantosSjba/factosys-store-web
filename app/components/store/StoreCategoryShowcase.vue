<script setup lang="ts">
const props = defineProps<{
  categoryId: string
  categoryName: string
  categorySlug: string
}>()

const { data: productsPage, isPending } = useStoreProductsQuery(
  computed(() => ({
    categoryId: props.categoryId,
    page: 1,
    limit: 4,
  })),
)

const products = computed(() => productsPage.value?.items ?? [])
const hasProducts = computed(
  () => isPending.value || products.value.length > 0,
)
</script>

<template>
  <StoreHomeSection
    v-if="hasProducts"
    :title="categoryName"
    :action-label="`Ver todo en ${categoryName}`"
    :action-to="{ path: '/productos', query: { categoria: categorySlug } }"
  >
    <StoreProductGrid
      :products="products"
      :loading="isPending"
      :skeleton-count="4"
      empty-message=""
    />
  </StoreHomeSection>
</template>

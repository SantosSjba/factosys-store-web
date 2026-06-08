import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  assignAdminCategoryAttributes,
  createAdminAttribute,
  createAdminBrand,
  createAdminCategory,
  createAdminProduct,
  deleteAdminAttribute,
  deleteAdminBrand,
  deleteAdminCategory,
  deleteAdminProduct,
  deleteAdminProductImage,
  reorderAdminProductImages,
  setAdminProductImagePrimary,
  updateAdminAttribute,
  updateAdminBrand,
  updateAdminCategory,
  updateAdminProduct,
} from '~/api/admin-catalog.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  AssignCategoryAttributesPayload,
  CreateAttributePayload,
  CreateBrandPayload,
  CreateCategoryPayload,
  CreateProductPayload,
  UpdateAttributePayload,
  UpdateBrandPayload,
  UpdateCategoryPayload,
  UpdateProductPayload,
} from '~/types/admin-catalog'

function invalidateCatalog(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.catalogCategories() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.catalogBrands() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.catalogAttributes() })
}

// Productos
export function useAdminCreateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createAdminProduct(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() }),
  })
}

export function useAdminUpdateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      updateAdminProduct(id, payload),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.product(vars.id) })
    },
  })
}

export function useAdminDeleteProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() }),
  })
}

export function useAdminDeleteProductImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      deleteAdminProductImage(productId, imageId),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.product(vars.productId) })
    },
  })
}

export function useAdminSetProductImagePrimaryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      productId,
      imageId,
      isPrimary,
    }: {
      productId: string
      imageId: string
      isPrimary: boolean
    }) => setAdminProductImagePrimary(productId, imageId, isPrimary),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.product(vars.productId) })
    },
  })
}

export function useAdminReorderProductImagesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      productId,
      imageIds,
    }: {
      productId: string
      imageIds: string[]
    }) => reorderAdminProductImages(productId, imageIds),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.product(vars.productId) })
    },
  })
}

// Categorías
export function useAdminCreateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createAdminCategory(payload),
    onSuccess: () => invalidateCatalog(queryClient),
  })
}

export function useAdminUpdateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      updateAdminCategory(id, payload),
    onSuccess: () => invalidateCatalog(queryClient),
  })
}

export function useAdminDeleteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminCategory(id),
    onSuccess: () => invalidateCatalog(queryClient),
  })
}

export function useAdminAssignCategoryAttributesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string
      payload: AssignCategoryAttributesPayload
    }) => assignAdminCategoryAttributes(categoryId, payload),
    onSuccess: () => invalidateCatalog(queryClient),
  })
}

// Marcas
export function useAdminCreateBrandMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateBrandPayload) => createAdminBrand(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.catalogBrands() }),
  })
}

export function useAdminUpdateBrandMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBrandPayload }) =>
      updateAdminBrand(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.catalogBrands() }),
  })
}

export function useAdminDeleteBrandMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminBrand(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.catalogBrands() }),
  })
}

// Atributos
export function useAdminCreateAttributeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAttributePayload) => createAdminAttribute(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.catalogAttributes() }),
  })
}

export function useAdminUpdateAttributeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAttributePayload }) =>
      updateAdminAttribute(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.catalogAttributes() }),
  })
}

export function useAdminDeleteAttributeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminAttribute(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.catalogAttributes() }),
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createAdminCoupon, updateAdminCoupon } from '~/api/admin-coupons.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { CreateCouponPayload, UpdateCouponPayload } from '~/types/admin-coupons'

export function useAdminCreateCouponMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCouponPayload) => createAdminCoupon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.coupons() })
    },
  })
}

export function useAdminUpdateCouponMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCouponPayload }) =>
      updateAdminCoupon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.coupons() })
    },
  })
}

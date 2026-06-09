import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminShippingZone,
  deleteAdminShippingZone,
  updateAdminShippingZone,
} from '~/api/admin-shipping-zones.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  CreateShippingZonePayload,
  UpdateShippingZonePayload,
} from '~/types/admin-shipping-zones'

export function useAdminCreateShippingZoneMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateShippingZonePayload) => createAdminShippingZone(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.shippingZones() })
    },
  })
}

export function useAdminUpdateShippingZoneMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShippingZonePayload }) =>
      updateAdminShippingZone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.shippingZones() })
    },
  })
}

export function useAdminDeleteShippingZoneMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminShippingZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.shippingZones() })
    },
  })
}

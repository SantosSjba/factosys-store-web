import type {
  CreateShippingZonePayload,
  ShippingZone,
  UpdateShippingZonePayload,
} from '~/types/admin-shipping-zones'

export async function fetchAdminShippingZones() {
  const { data } = await useAdminApi().get<ShippingZone[]>(
    '/admin/settings/shipping-zones',
  )
  return data
}

export async function createAdminShippingZone(payload: CreateShippingZonePayload) {
  const { data } = await useAdminApi().post<ShippingZone>(
    '/admin/settings/shipping-zones',
    payload,
  )
  return data
}

export async function updateAdminShippingZone(id: string, payload: UpdateShippingZonePayload) {
  const { data } = await useAdminApi().patch<ShippingZone>(
    `/admin/settings/shipping-zones/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminShippingZone(id: string) {
  const { data } = await useAdminApi().delete<{ deleted: boolean }>(
    `/admin/settings/shipping-zones/${id}`,
  )
  return data
}

import type { StoreSettings } from '~/types/admin-settings'

type PickupPointFields = Pick<
  StoreSettings,
  | 'pickupPointName'
  | 'pickupPointAddress'
  | 'pickupPointDistrict'
  | 'pickupPointProvince'
  | 'pickupPointDepartment'
  | 'pickupPointHours'
  | 'pickupPointPhone'
>

export function formatPickupPointAddress(settings: PickupPointFields) {
  return [
    settings.pickupPointAddress,
    settings.pickupPointDistrict,
    settings.pickupPointProvince,
    settings.pickupPointDepartment,
  ]
    .filter(Boolean)
    .join(', ')
}

export function hasPickupPoint(settings: PickupPointFields) {
  return Boolean(
    settings.pickupPointName ||
      settings.pickupPointAddress ||
      settings.pickupPointPhone ||
      settings.pickupPointHours,
  )
}

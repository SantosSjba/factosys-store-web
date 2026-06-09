import type { CustomerSavedAddress } from '~/types/admin-customers'

export function formatCustomerAddress(address: {
  addressLine1: string
  addressLine2?: string | null
  district?: string | null
  province?: string | null
  department?: string | null
  country?: string
  postalCode?: string | null
}) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.district,
    address.province,
    address.department,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ')
}

export function formatCustomerAddressLabel(address: CustomerSavedAddress) {
  if (address.label) return address.label
  if (address.type === 'SHIPPING') return 'Envío'
  return 'Facturación'
}

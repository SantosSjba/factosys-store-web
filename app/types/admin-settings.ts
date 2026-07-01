export type CompanyProfile = {
  id: string
  legalName: string | null
  tradeName: string | null
  taxId: string | null
  taxRegime: string | null
  fiscalAddress: string | null
  district: string | null
  province: string | null
  department: string | null
  country: string
  supportEmail: string | null
  supportPhone: string | null
  whatsapp: string | null
  website: string | null
  logoUrl: string | null
  createdAt: string
  updatedAt: string
}

export type StoreSettings = {
  id: string
  storeName: string
  storeTagline: string | null
  logoUrl: string | null
  faviconUrl: string | null
  defaultLocale: string
  timezone: string
  defaultCurrencyCode: string
  defaultTaxRateId: string | null
  defaultTaxRateName: string | null
  pricesIncludeTax: boolean
  metaTitleDefault: string | null
  metaDescriptionDefault: string | null
  maintenanceMode: boolean
  maintenanceMessage: string | null
  guestCheckoutEnabled: boolean
  minOrderAmount: string | null
  orderNumberPrefix: string
  defaultWarehouseId: string | null
  defaultWarehouseName: string | null
  lowStockGlobalThreshold: number | null
  freeShippingMinAmount: string | null
  flatShippingFee: string | null
  handlingDaysMin: number | null
  handlingDaysMax: number | null
  pickupPointName: string | null
  pickupPointAddress: string | null
  pickupPointDistrict: string | null
  pickupPointProvince: string | null
  pickupPointDepartment: string | null
  pickupPointHours: string | null
  pickupPointPhone: string | null
  paymentCashEnabled: boolean
  paymentBankTransferEnabled: boolean
  paymentYapeEnabled: boolean
  paymentPlinEnabled: boolean
  bankTransferInstructions: string | null
  yapeNumber: string | null
  plinNumber: string | null
  abandonedGatewayOrderExpiryHours: number | null
  warrantyPolicyUrl: string | null
  returnsPolicyUrl: string | null
  privacyPolicyUrl: string | null
  termsUrl: string | null
  complaintsBookUrl: string | null
  serialNumberRequired: boolean
  orderConfirmationEmailEnabled: boolean
  mailFromName: string | null
  createdAt: string
  updatedAt: string
}

export type SettingsCurrency = {
  id: string
  code: string
  name: string
  symbol: string
  exchangeRate: string
  decimalPlaces: number
  isDefault: boolean
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type SettingsTaxRate = {
  id: string
  name: string
  code: string | null
  rate: string
  isDefault: boolean
  isActive: boolean
  appliesToShipping: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type UpdateCompanyPayload = Partial<
  Pick<
    CompanyProfile,
    | 'legalName'
    | 'tradeName'
    | 'taxId'
    | 'taxRegime'
    | 'fiscalAddress'
    | 'district'
    | 'province'
    | 'department'
    | 'country'
    | 'supportEmail'
    | 'supportPhone'
    | 'whatsapp'
    | 'website'
  >
>

export type UpdateStoreSettingsPayload = {
  storeName?: string
  storeTagline?: string
  defaultLocale?: string
  timezone?: string
  defaultCurrencyCode?: string
  defaultTaxRateId?: string | null
  pricesIncludeTax?: boolean
  metaTitleDefault?: string
  metaDescriptionDefault?: string
  maintenanceMode?: boolean
  maintenanceMessage?: string
  guestCheckoutEnabled?: boolean
  minOrderAmount?: number | null
  orderNumberPrefix?: string
  defaultWarehouseId?: string | null
  lowStockGlobalThreshold?: number | null
  freeShippingMinAmount?: number | null
  flatShippingFee?: number | null
  handlingDaysMin?: number | null
  handlingDaysMax?: number | null
  pickupPointName?: string | null
  pickupPointAddress?: string | null
  pickupPointDistrict?: string | null
  pickupPointProvince?: string | null
  pickupPointDepartment?: string | null
  pickupPointHours?: string | null
  pickupPointPhone?: string | null
  paymentCashEnabled?: boolean
  paymentBankTransferEnabled?: boolean
  paymentYapeEnabled?: boolean
  paymentPlinEnabled?: boolean
  bankTransferInstructions?: string | null
  yapeNumber?: string | null
  plinNumber?: string | null
  abandonedGatewayOrderExpiryHours?: number | null
  warrantyPolicyUrl?: string
  returnsPolicyUrl?: string
  privacyPolicyUrl?: string
  termsUrl?: string
  complaintsBookUrl?: string
  serialNumberRequired?: boolean
  orderConfirmationEmailEnabled?: boolean
  mailFromName?: string
}

export type CreateCurrencyPayload = {
  code: string
  name: string
  symbol: string
  exchangeRate?: number
  decimalPlaces?: number
  isDefault?: boolean
  isActive?: boolean
  sortOrder?: number
}

export type UpdateCurrencyPayload = Partial<CreateCurrencyPayload>

export type CreateTaxRatePayload = {
  name: string
  code?: string
  rate: number
  isDefault?: boolean
  isActive?: boolean
  appliesToShipping?: boolean
  sortOrder?: number
}

export type UpdateTaxRatePayload = Partial<CreateTaxRatePayload>

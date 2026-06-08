import type {
  CompanyProfile,
  CreateCurrencyPayload,
  CreateTaxRatePayload,
  SettingsCurrency,
  SettingsTaxRate,
  StoreSettings,
  UpdateCompanyPayload,
  UpdateCurrencyPayload,
  UpdateStoreSettingsPayload,
  UpdateTaxRatePayload,
} from '~/types/admin-settings'
import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

export async function fetchAdminCompany() {
  const { data } = await useAdminApi().get<CompanyProfile>('/admin/settings/company')
  return data
}

export async function updateAdminCompany(payload: UpdateCompanyPayload) {
  const { data } = await useAdminApi().patch<CompanyProfile>('/admin/settings/company', payload)
  return data
}

export async function uploadAdminCompanyLogo(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await useAdminApi().post<CompanyProfile>(
    '/admin/settings/company/logo',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

export async function deleteAdminCompanyLogo() {
  const { data } = await useAdminApi().delete<CompanyProfile>('/admin/settings/company/logo')
  return data
}

export async function fetchAdminStoreSettings() {
  const { data } = await useAdminApi().get<StoreSettings>('/admin/settings/store')
  return data
}

export async function updateAdminStoreSettings(payload: UpdateStoreSettingsPayload) {
  const { data } = await useAdminApi().patch<StoreSettings>('/admin/settings/store', payload)
  return data
}

export async function uploadAdminStoreLogo(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await useAdminApi().post<StoreSettings>(
    '/admin/settings/store/logo',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

export async function deleteAdminStoreLogo() {
  const { data } = await useAdminApi().delete<StoreSettings>('/admin/settings/store/logo')
  return data
}

export async function uploadAdminStoreFavicon(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await useAdminApi().post<StoreSettings>(
    '/admin/settings/store/favicon',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

export async function deleteAdminStoreFavicon() {
  const { data } = await useAdminApi().delete<StoreSettings>('/admin/settings/store/favicon')
  return data
}

export async function fetchAdminCurrencies(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<SettingsCurrency>>(
    '/admin/settings/currencies',
    { params: { page: 1, limit: 10, ...params } },
  )
  return data
}

export async function fetchAdminActiveCurrencies() {
  const { data } = await useAdminApi().get<SettingsCurrency[]>('/admin/settings/currencies/active')
  return data
}

export async function createAdminCurrency(payload: CreateCurrencyPayload) {
  const { data } = await useAdminApi().post<SettingsCurrency>('/admin/settings/currencies', payload)
  return data
}

export async function updateAdminCurrency(id: string, payload: UpdateCurrencyPayload) {
  const { data } = await useAdminApi().patch<SettingsCurrency>(
    `/admin/settings/currencies/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminCurrency(id: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(
    `/admin/settings/currencies/${id}`,
  )
  return data
}

export async function fetchAdminTaxRates(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<SettingsTaxRate>>(
    '/admin/settings/taxes',
    { params: { page: 1, limit: 10, ...params } },
  )
  return data
}

export async function fetchAdminActiveTaxRates() {
  const { data } = await useAdminApi().get<SettingsTaxRate[]>('/admin/settings/taxes/active')
  return data
}

export async function createAdminTaxRate(payload: CreateTaxRatePayload) {
  const { data } = await useAdminApi().post<SettingsTaxRate>('/admin/settings/taxes', payload)
  return data
}

export async function updateAdminTaxRate(id: string, payload: UpdateTaxRatePayload) {
  const { data } = await useAdminApi().patch<SettingsTaxRate>(
    `/admin/settings/taxes/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminTaxRate(id: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(`/admin/settings/taxes/${id}`)
  return data
}

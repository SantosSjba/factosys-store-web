import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminCurrency,
  createAdminTaxRate,
  deleteAdminCompanyLogo,
  deleteAdminCurrency,
  deleteAdminStoreFavicon,
  deleteAdminStoreLogo,
  deleteAdminTaxRate,
  updateAdminCompany,
  updateAdminCurrency,
  updateAdminStoreSettings,
  updateAdminTaxRate,
  uploadAdminCompanyLogo,
  uploadAdminStoreFavicon,
  uploadAdminStoreLogo,
} from '~/api/admin-settings.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  CreateCurrencyPayload,
  CreateTaxRatePayload,
  UpdateCompanyPayload,
  UpdateCurrencyPayload,
  UpdateStoreSettingsPayload,
  UpdateTaxRatePayload,
} from '~/types/admin-settings'

function invalidateSettings(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsCompany() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsStore() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsCurrencies() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsActiveCurrencies() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsTaxes() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsActiveTaxes() })
}

export function useAdminUpdateCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) => updateAdminCompany(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsCompany() }),
  })
}

export function useAdminUploadCompanyLogoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadAdminCompanyLogo(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsCompany() }),
  })
}

export function useAdminDeleteCompanyLogoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAdminCompanyLogo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsCompany() }),
  })
}

export function useAdminUpdateStoreSettingsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateStoreSettingsPayload) => updateAdminStoreSettings(payload),
    onSuccess: () => invalidateSettings(queryClient),
  })
}

export function useAdminUploadStoreLogoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadAdminStoreLogo(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsStore() }),
  })
}

export function useAdminDeleteStoreLogoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAdminStoreLogo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsStore() }),
  })
}

export function useAdminUploadStoreFaviconMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadAdminStoreFavicon(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsStore() }),
  })
}

export function useAdminDeleteStoreFaviconMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAdminStoreFavicon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsStore() }),
  })
}

export function useAdminCreateCurrencyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCurrencyPayload) => createAdminCurrency(payload),
    onSuccess: () => invalidateSettings(queryClient),
  })
}

export function useAdminUpdateCurrencyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCurrencyPayload }) =>
      updateAdminCurrency(id, payload),
    onSuccess: () => invalidateSettings(queryClient),
  })
}

export function useAdminDeleteCurrencyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminCurrency(id),
    onSuccess: () => invalidateSettings(queryClient),
  })
}

export function useAdminCreateTaxRateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaxRatePayload) => createAdminTaxRate(payload),
    onSuccess: () => invalidateSettings(queryClient),
  })
}

export function useAdminUpdateTaxRateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaxRatePayload }) =>
      updateAdminTaxRate(id, payload),
    onSuccess: () => invalidateSettings(queryClient),
  })
}

export function useAdminDeleteTaxRateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminTaxRate(id),
    onSuccess: () => invalidateSettings(queryClient),
  })
}

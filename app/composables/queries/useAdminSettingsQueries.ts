import { useQuery } from '@tanstack/vue-query'
import {
  fetchAdminActiveCurrencies,
  fetchAdminActiveTaxRates,
  fetchAdminCompany,
  fetchAdminCurrencies,
  fetchAdminStoreSettings,
  fetchAdminTaxRates,
} from '~/api/admin-settings.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { PaginationParams } from '~/types/pagination'

function settingsEnabled(canRead: () => boolean) {
  const adminAuth = useAdminAuthStore()
  return computed(() => {
    if (!adminAuth.accessToken) return false
    if (!adminAuth.profile) return true
    return canRead()
  })
}

export function useAdminCompanyQuery() {
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.settingsCompany(),
    queryFn: fetchAdminCompany,
    enabled: settingsEnabled(() => can('settings.read')),
  })
}

export function useAdminStoreSettingsQuery() {
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.settingsStore(),
    queryFn: fetchAdminStoreSettings,
    enabled: settingsEnabled(() => can('settings.read')),
  })
}

export function useAdminCurrenciesQuery(params: MaybeRefOrGetter<PaginationParams> = {}) {
  const { can } = useAdminPermissions()
  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.settingsCurrencies(), queryParams.value]),
    queryFn: () => fetchAdminCurrencies(queryParams.value),
    enabled: settingsEnabled(() => can('settings.read')),
  })
}

export function useAdminActiveCurrenciesQuery() {
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.settingsActiveCurrencies(),
    queryFn: fetchAdminActiveCurrencies,
    enabled: settingsEnabled(() => can('settings.read')),
  })
}

export function useAdminTaxRatesQuery(params: MaybeRefOrGetter<PaginationParams> = {}) {
  const { can } = useAdminPermissions()
  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.settingsTaxes(), queryParams.value]),
    queryFn: () => fetchAdminTaxRates(queryParams.value),
    enabled: settingsEnabled(() => can('settings.read')),
  })
}

export function useAdminActiveTaxRatesQuery() {
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.settingsActiveTaxes(),
    queryFn: fetchAdminActiveTaxRates,
    enabled: settingsEnabled(() => can('settings.read')),
  })
}

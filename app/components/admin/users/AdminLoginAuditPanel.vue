<script setup lang="ts">
import type { LoginAuditEntry } from '~/types/admin-login-audit'
import type { UiTableColumn } from '~/types/ui'

const { data: audits, isPending } = useAdminLoginAuditQuery()

const columns: UiTableColumn<LoginAuditEntry>[] = [
  { key: 'createdAt', label: 'Fecha', width: '10rem' },
  { key: 'email', label: 'Correo' },
  { key: 'result', label: 'Resultado', width: '7rem' },
  { key: 'method', label: 'Método', width: '7rem' },
  { key: 'audience', label: 'Audiencia', width: '7rem' },
  { key: 'ipAddress', label: 'IP', width: '9rem' },
]

function formatMethod(method: string) {
  const labels: Record<string, string> = {
    PASSWORD: 'Contraseña',
    GOOGLE: 'Google',
    REFRESH: 'Refresh',
  }
  return labels[method] ?? method
}

function formatAudience(audience: string) {
  return audience === 'ADMIN' ? 'Admin' : 'Tienda'
}
</script>

<template>
  <AdminCard no-padding>
    <UiDataTable
      :columns="columns"
      :rows="audits ?? []"
      :loading="isPending"
      empty-message="Sin registros de inicio de sesión."
    >
      <template #cell-createdAt="{ row }">
        {{ formatAdminDate(row.createdAt) }}
      </template>
      <template #cell-email="{ row }">
        <div>
          <p class="font-medium">{{ row.email }}</p>
          <p v-if="row.failureReason" class="text-admin-muted text-xs">
            {{ row.failureReason }}
          </p>
        </div>
      </template>
      <template #cell-result="{ row }">
        <UiBadge :variant="row.result === 'SUCCESS' ? 'success' : 'danger'">
          {{ row.result === 'SUCCESS' ? 'OK' : 'Fallo' }}
        </UiBadge>
      </template>
      <template #cell-method="{ row }">
        {{ formatMethod(row.method) }}
      </template>
      <template #cell-audience="{ row }">
        {{ formatAudience(row.audience) }}
      </template>
      <template #cell-ipAddress="{ row }">
        <span class="font-mono text-xs">{{ row.ipAddress || '—' }}</span>
      </template>
    </UiDataTable>
  </AdminCard>
</template>

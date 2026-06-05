<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Dashboard',
})

const adminAuth = useAdminAuthStore()
const { data: profile, isPending } = useAdminProfileQuery()

const permissionsCount = computed(() => profile.value?.permissions.length ?? '—')
</script>

<template>
  <div>
    <AdminPageTitle
      title="Dashboard"
      :description="`Bienvenido, ${adminAuth.displayName || 'usuario staff'}. Vista general del panel admin.`"
    />

    <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Pedidos hoy"
        value="—"
        hint="Módulo pedidos"
        icon="orders"
        trend="+ 0%"
        :trend-up="true"
      />
      <AdminStatCard
        label="Productos"
        value="—"
        hint="Módulo catálogo"
        icon="catalog"
      />
      <AdminStatCard
        label="Usuarios staff"
        value="—"
        hint="Módulo usuarios"
        icon="users"
      />
      <AdminStatCard
        label="Permisos activos"
        :value="permissionsCount"
        hint="Tu sesión"
        icon="settings"
      />
    </div>

    <AdminCard
      title="Tu perfil (API admin)"
      description="Datos desde GET /api/admin/users/me"
    >
      <div v-if="isPending" class="text-sm text-slate-500">Cargando perfil…</div>

      <div v-else-if="profile" class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl bg-slate-50 p-4">
          <p class="text-xs font-medium uppercase text-slate-500">Correo</p>
          <p class="mt-1 font-medium text-slate-900">{{ profile.email }}</p>
        </div>
        <div class="rounded-xl bg-slate-50 p-4">
          <p class="text-xs font-medium uppercase text-slate-500">Roles</p>
          <p class="mt-1 font-medium text-slate-900">
            {{ profile.roles.join(', ') || '—' }}
          </p>
        </div>
        <div class="rounded-xl bg-slate-50 p-4 sm:col-span-2">
          <p class="text-xs font-medium uppercase text-slate-500">Permisos</p>
          <p class="mt-1 text-sm text-slate-700">
            {{ profile.permissions.length }} asignados
          </p>
        </div>
      </div>
    </AdminCard>
  </div>
</template>

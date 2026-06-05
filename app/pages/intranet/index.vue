<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Dashboard',
})

const adminAuth = useAdminAuthStore()
const { data: profile, isPending } = useAdminProfileQuery()

const permissionsCount = computed(() => profile.value?.permissions.length ?? '—')

const rolesLabel = computed(() => formatRoleNames(profile.value?.roles))
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
      <div v-if="isPending" class="text-admin-muted text-sm">Cargando perfil…</div>

      <div v-else-if="profile" class="grid gap-4 sm:grid-cols-2">
        <div class="bg-admin-surface rounded-xl p-4">
          <p class="text-admin-muted text-xs font-medium uppercase">Correo</p>
          <p class="text-admin mt-1 font-medium">{{ profile.email }}</p>
        </div>
        <div class="bg-admin-surface rounded-xl p-4">
          <p class="text-admin-muted text-xs font-medium uppercase">Roles</p>
          <p class="text-admin mt-1 font-medium">
            {{ rolesLabel }}
          </p>
        </div>
        <div class="bg-admin-surface rounded-xl p-4 sm:col-span-2">
          <p class="text-admin-muted text-xs font-medium uppercase">Permisos</p>
          <p class="text-admin mt-1 text-sm">
            {{ profile.permissions.length }} asignados
          </p>
        </div>
      </div>
    </AdminCard>
  </div>
</template>

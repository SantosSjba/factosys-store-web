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

const displayName = computed(() =>
  profile.value ? formatUserName(profile.value) : '',
)
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
      title="Tu perfil"
      description="Resumen de tu sesión en el panel administrativo"
    >
      <div v-if="isPending" class="text-admin-muted text-sm">Cargando perfil…</div>

      <div v-else-if="profile" class="grid gap-4 sm:grid-cols-2">
        <AdminDetailCell label="Nombre">
          <p class="font-medium">{{ displayName }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Correo">
          <p class="font-medium">{{ profile.email }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Roles">
          <p class="font-medium">{{ rolesLabel }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Permisos">
          <p class="text-sm">{{ profile.permissions.length }} asignados</p>
        </AdminDetailCell>
      </div>
    </AdminCard>
  </div>
</template>

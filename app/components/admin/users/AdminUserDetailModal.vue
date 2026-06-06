<script setup lang="ts">
import { formatPermissionLabel } from '~/constants/admin-permissions'
import type { StaffUser } from '~/types/admin-users'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  user: StaffUser | null
}>()

const emit = defineEmits<{
  edit: []
}>()

const { can } = useAdminPermissions()

const displayName = computed(() =>
  props.user ? formatUserName(props.user) : '',
)

const permissionsByModule = computed(() =>
  props.user ? groupPermissionSlugsByModule(props.user.permissions) : [],
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Detalle del usuario"
    :description="user?.email"
    size="lg"
  >
    <div v-if="user" class="space-y-5">
      <div class="grid gap-3 sm:grid-cols-2">
        <AdminDetailCell label="Nombre">
          <p class="font-medium">{{ displayName }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Estado">
          <UiBadge :variant="userStatusVariant(user.status)" class="normal-case">
            {{ formatUserStatus(user.status) }}
          </UiBadge>
        </AdminDetailCell>
        <AdminDetailCell label="Teléfono">
          {{ user.phone || '—' }}
        </AdminDetailCell>
        <AdminDetailCell label="Registrado">
          <span class="text-sm">{{ formatAdminDateTime(user.createdAt) }}</span>
        </AdminDetailCell>
      </div>

      <div>
        <p class="text-admin-muted mb-2 text-xs font-medium uppercase">Roles</p>
        <div class="flex flex-wrap gap-2">
          <UiBadge
            v-for="role in user.roles"
            :key="role.slug"
            variant="primary"
            class="normal-case"
          >
            {{ role.name }}
          </UiBadge>
          <span v-if="!user.roles.length" class="text-admin-muted text-sm">—</span>
        </div>
      </div>

      <div>
        <p class="text-admin-muted mb-2 text-xs font-medium uppercase">
          Permisos efectivos ({{ user.permissions.length }})
        </p>
        <div class="space-y-3">
          <div
            v-for="group in permissionsByModule"
            :key="group.module"
            class="border-admin-line rounded-xl border p-3"
          >
            <p class="text-admin mb-2 text-sm font-semibold">{{ group.label }}</p>
            <div class="flex flex-wrap gap-2">
              <UiBadge
                v-for="permission in group.permissions"
                :key="permission"
                variant="info"
                class="normal-case"
              >
                {{ formatPermissionLabel(permission) }}
              </UiBadge>
            </div>
          </div>
          <p v-if="!permissionsByModule.length" class="text-admin-muted text-sm">
            Sin permisos asignados.
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <UiButton variant="ghost" @click="open = false">Cerrar</UiButton>
      <UiButton
        v-if="can('users.update')"
        @click="emit('edit')"
      >
        Editar usuario
      </UiButton>
    </template>
  </UiModal>
</template>

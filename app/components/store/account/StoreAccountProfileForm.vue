<script setup lang="ts">
import type { StoreProfile } from '~/types/auth'
import { updateStoreProfileSchema } from '~/utils/validation/schemas'

const props = defineProps<{
  profile: StoreProfile
}>()

const updateMutation = useUpdateStoreProfileMutation()
const toast = useToast()

const isGoogleAccount = computed(() => props.profile.authProvider === 'GOOGLE')

const { createSubmitHandler, withMutationPending, resetForm } = useApiForm({
  schema: updateStoreProfileSchema,
  initialValues: {
    firstName: props.profile.firstName ?? '',
    lastName: props.profile.lastName ?? '',
    phone: props.profile.phone ?? '',
    password: '',
    confirmPassword: '',
  },
})

const isSubmitting = withMutationPending(updateMutation)

watch(
  () => props.profile,
  (profile) => {
    resetForm({
      values: {
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        phone: profile.phone ?? '',
        password: '',
        confirmPassword: '',
      },
    })
  },
)

const onSubmit = createSubmitHandler(
  async (values) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      ...(values.password ? { password: values.password } : {}),
    }

    await updateMutation.mutateAsync(payload)
    resetForm({
      values: {
        firstName: values.firstName ?? '',
        lastName: values.lastName ?? '',
        phone: values.phone ?? '',
        password: '',
        confirmPassword: '',
      },
    })
    toast.success('Perfil actualizado correctamente.')
  },
  {
    invalidMessage: 'Revisa los campos del formulario.',
  },
)
</script>

<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <UiFormField name="firstName" label="Nombre" autocomplete="given-name" />
      <UiFormField name="lastName" label="Apellido" autocomplete="family-name" />
    </div>

    <UiFormField
      name="phone"
      label="Teléfono"
      type="tel"
      autocomplete="tel"
      hint="Útil para coordinar entregas y soporte"
    />

    <div
      v-if="!isGoogleAccount"
      class="border-theme bg-theme-muted/50 space-y-4 rounded-xl border p-4"
    >
      <div>
        <p class="text-theme text-sm font-semibold">Cambiar contraseña</p>
        <p class="text-theme-muted mt-1 text-xs">
          Déjalo en blanco si no deseas cambiarla.
        </p>
      </div>
      <UiFormField
        name="password"
        label="Nueva contraseña"
        type="password"
        autocomplete="new-password"
        hint="Mínimo 8 caracteres"
      />
      <UiFormField
        name="confirmPassword"
        label="Confirmar contraseña"
        type="password"
        autocomplete="new-password"
      />
    </div>

    <UiAlert v-else variant="info">
      <p class="font-medium">Cuenta vinculada con Google</p>
      <p class="mt-1 text-sm opacity-90">
        Tu acceso se gestiona con Google. No puedes establecer contraseña local.
      </p>
    </UiAlert>

    <div class="flex flex-col gap-3 sm:flex-row">
      <UiButton type="submit" :loading="isSubmitting">
        Guardar cambios
      </UiButton>
    </div>
  </form>
</template>

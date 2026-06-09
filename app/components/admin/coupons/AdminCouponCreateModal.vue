<script setup lang="ts">
import type { CouponType, CreateCouponPayload } from '~/types/admin-coupons'

const open = defineModel<boolean>({ required: true })
const createMutation = useAdminCreateCouponMutation()

const code = ref('')
const type = ref<CouponType>('PERCENT')
const value = ref<number | ''>('')
const minOrderAmount = ref<number | ''>('')
const maxUses = ref<number | ''>('')
const startsAt = ref('')
const expiresAt = ref('')
const isActive = ref(true)
const formError = ref('')

const isSubmitting = computed(() => createMutation.isPending.value)

function resetForm() {
  code.value = ''
  type.value = 'PERCENT'
  value.value = ''
  minOrderAmount.value = ''
  maxUses.value = ''
  startsAt.value = ''
  expiresAt.value = ''
  isActive.value = true
  formError.value = ''
}

watch(open, (v) => {
  if (!v) resetForm()
})

async function onSubmit() {
  formError.value = ''
  if (!code.value.trim()) {
    formError.value = 'El código es obligatorio.'
    return
  }
  if (value.value === '' || Number(value.value) <= 0) {
    formError.value = 'Ingresa un valor válido.'
    return
  }
  if (type.value === 'PERCENT' && Number(value.value) > 100) {
    formError.value = 'El porcentaje no puede superar 100.'
    return
  }

  const payload: CreateCouponPayload = {
    code: code.value.trim().toUpperCase(),
    type: type.value,
    value: Number(value.value),
    isActive: isActive.value,
    minOrderAmount: minOrderAmount.value === '' ? undefined : Number(minOrderAmount.value),
    maxUses: maxUses.value === '' ? undefined : Number(maxUses.value),
    startsAt: startsAt.value ? new Date(`${startsAt.value}T00:00:00`).toISOString() : undefined,
    expiresAt: expiresAt.value
      ? new Date(`${expiresAt.value}T23:59:59`).toISOString()
      : undefined,
  }

  try {
    await createMutation.mutateAsync(payload)
    useToast().success('Cupón creado correctamente')
    open.value = false
  } catch (error) {
    formError.value = useApiErrorMessage(error)
  }
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Nuevo cupón"
    description="Define el código, el descuento y las reglas de uso."
    size="lg"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <UiAlert v-if="formError" variant="error">{{ formError }}</UiAlert>

      <AdminFormSection
        title="Código y descuento"
        description="El código se guardará en mayúsculas."
        icon="lucide:ticket"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiInput
            v-model="code"
            label="Código"
            placeholder="VERANO20"
            required
            class="font-mono uppercase sm:col-span-2"
          />
          <UiSelect
            v-model="type"
            label="Tipo de descuento"
            :options="[
              { label: 'Porcentaje', value: 'PERCENT' },
              { label: 'Monto fijo', value: 'FIXED' },
            ]"
          />
          <UiInput
            v-model.number="value"
            label="Valor"
            type="number"
            min="0.01"
            step="0.01"
            required
            :hint="type === 'PERCENT' ? 'Entre 1 y 100 %' : 'Monto en moneda de la tienda'"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Reglas de uso"
        description="Opcional. Restringe cuándo y cómo se puede aplicar."
        icon="lucide:sliders-horizontal"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiInput
            v-model.number="minOrderAmount"
            label="Monto mínimo de pedido"
            type="number"
            min="0"
            step="0.01"
          />
          <UiInput
            v-model.number="maxUses"
            label="Máximo de usos"
            type="number"
            min="1"
            step="1"
          />
          <UiInput v-model="startsAt" label="Vigente desde" type="date" />
          <UiInput v-model="expiresAt" label="Vigente hasta" type="date" />
          <UiCheckbox v-model="isActive" label="Cupón activo" class="sm:col-span-2" />
        </div>
      </AdminFormSection>
    </form>

    <template #footer>
      <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
      <UiButton :loading="isSubmitting" @click="onSubmit">Crear cupón</UiButton>
    </template>
  </UiModal>
</template>

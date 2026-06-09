<script setup lang="ts">
import type { AdminCoupon, CouponType, UpdateCouponPayload } from '~/types/admin-coupons'
import {
  couponLifecycleVariant,
  formatCouponLifecycleStatus,
  getCouponLifecycleStatus,
} from '~/utils/format-coupon'

const props = defineProps<{
  coupon: AdminCoupon | null
}>()

const open = defineModel<boolean>({ required: true })
const updateMutation = useAdminUpdateCouponMutation()

const code = ref('')
const type = ref<CouponType>('PERCENT')
const value = ref<number | ''>('')
const minOrderAmount = ref<number | ''>('')
const maxUses = ref<number | ''>('')
const startsAt = ref('')
const expiresAt = ref('')
const isActive = ref(true)
const formError = ref('')

const isSubmitting = computed(() => updateMutation.isPending.value)

const lifecycleStatus = computed(() =>
  props.coupon ? getCouponLifecycleStatus(props.coupon) : 'inactive',
)

function toDateInput(iso: string | null) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

watch(
  () => props.coupon,
  (coupon) => {
    if (!coupon) return
    code.value = coupon.code
    type.value = coupon.type
    value.value = Number(coupon.value)
    minOrderAmount.value = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : ''
    maxUses.value = coupon.maxUses ?? ''
    startsAt.value = toDateInput(coupon.startsAt)
    expiresAt.value = toDateInput(coupon.expiresAt)
    isActive.value = coupon.isActive
    formError.value = ''
  },
  { immediate: true },
)

async function onSubmit() {
  if (!props.coupon) return
  formError.value = ''

  const payload: UpdateCouponPayload = {
    code: code.value.trim().toUpperCase(),
    type: type.value,
    value: value.value === '' ? undefined : Number(value.value),
    isActive: isActive.value,
    minOrderAmount:
      minOrderAmount.value === '' ? undefined : Number(minOrderAmount.value),
    maxUses: maxUses.value === '' ? undefined : Number(maxUses.value),
    startsAt: startsAt.value
      ? new Date(`${startsAt.value}T00:00:00`).toISOString()
      : undefined,
    expiresAt: expiresAt.value
      ? new Date(`${expiresAt.value}T23:59:59`).toISOString()
      : undefined,
  }

  try {
    await updateMutation.mutateAsync({ id: props.coupon.id, payload })
    useToast().success('Cupón actualizado')
    open.value = false
  } catch (error) {
    formError.value = useApiErrorMessage(error)
  }
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Editar cupón"
    description="Actualiza reglas y disponibilidad del código."
    size="lg"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <UiAlert v-if="formError" variant="error">{{ formError }}</UiAlert>

      <div
        v-if="coupon"
        class="border-admin-line bg-admin-muted/20 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
      >
        <div>
          <p class="text-admin-muted text-xs">Estado actual</p>
          <UiBadge :variant="couponLifecycleVariant(lifecycleStatus)" class="mt-1">
            {{ formatCouponLifecycleStatus(lifecycleStatus) }}
          </UiBadge>
        </div>
        <div class="text-right">
          <p class="text-admin-muted text-xs">Usos registrados</p>
          <p class="font-medium">{{ coupon.usedCount }}</p>
        </div>
      </div>

      <AdminFormSection title="Código y descuento" icon="lucide:ticket">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiInput v-model="code" label="Código" required class="font-mono uppercase sm:col-span-2" />
          <UiSelect
            v-model="type"
            label="Tipo de descuento"
            :options="[
              { label: 'Porcentaje', value: 'PERCENT' },
              { label: 'Monto fijo', value: 'FIXED' },
            ]"
          />
          <UiInput v-model.number="value" label="Valor" type="number" min="0.01" step="0.01" />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Reglas de uso" icon="lucide:sliders-horizontal">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiInput
            v-model.number="minOrderAmount"
            label="Monto mínimo de pedido"
            type="number"
            min="0"
            step="0.01"
          />
          <UiInput v-model.number="maxUses" label="Máximo de usos" type="number" min="1" />
          <UiInput v-model="startsAt" label="Vigente desde" type="date" />
          <UiInput v-model="expiresAt" label="Vigente hasta" type="date" />
          <UiCheckbox v-model="isActive" label="Cupón activo" class="sm:col-span-2" />
        </div>
      </AdminFormSection>
    </form>

    <template #footer>
      <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
      <UiButton :loading="isSubmitting" @click="onSubmit">Guardar cambios</UiButton>
    </template>
  </UiModal>
</template>

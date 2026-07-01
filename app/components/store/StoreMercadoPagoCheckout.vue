<script setup lang="ts">
import type { MercadoPagoCheckoutChannel } from '~/types/store-checkout'
import type { UiTabItem } from '~/types/ui'

const props = defineProps<{
  orderId: string
  amount: number
  payerEmail: string
  publicKey: string
  isTestMode?: boolean
  methods: MercadoPagoCheckoutChannel[]
}>()

const emit = defineEmits<{
  success: [orderNumber: string]
}>()

const activeChannel = ref(props.methods[0]?.channel ?? 'card')

const tabs = computed<UiTabItem[]>(() =>
  props.methods.map((method) => ({
    id: method.channel,
    label: method.label,
    icon: method.channel === 'yape' ? 'lucide:smartphone' : 'lucide:credit-card',
  })),
)

const yapeMethod = computed(() =>
  props.methods.find((method) => method.channel === 'yape'),
)

watch(
  () => props.methods,
  (methods) => {
    if (!methods.some((method) => method.channel === activeChannel.value)) {
      activeChannel.value = methods[0]?.channel ?? 'card'
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="space-y-4">
    <UiTabs
      v-if="methods.length > 1"
      v-model="activeChannel"
      :tabs="tabs"
    />

    <StoreMercadoPagoCardPaymentBrick
      v-if="activeChannel === 'card'"
      :order-id="orderId"
      :amount="amount"
      :payer-email="payerEmail"
      :public-key="publicKey"
      @success="emit('success', $event)"
    />

    <StoreMercadoPagoYapeForm
      v-else-if="activeChannel === 'yape'"
      :order-id="orderId"
      :amount="amount"
      :payer-email="payerEmail"
      :public-key="publicKey"
      :max-amount="yapeMethod?.maxAmount"
      :is-test-mode="isTestMode"
      @success="emit('success', $event)"
    />
  </div>
</template>

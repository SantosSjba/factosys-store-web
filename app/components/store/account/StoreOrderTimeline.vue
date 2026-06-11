<script setup lang="ts">
import type { StoreOrderStatusHistoryEntry } from '~/types/store-orders'

const props = defineProps<{
  history: StoreOrderStatusHistoryEntry[]
}>()

const entries = computed(() =>
  [...props.history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  ),
)
</script>

<template>
  <section v-if="entries.length > 0" class="space-y-4">
    <h2 class="text-theme text-lg font-bold">Historial del pedido</h2>
    <ol class="space-y-4">
      <li
        v-for="(entry, index) in entries"
        :key="entry.id"
        class="relative flex gap-4 pl-1"
      >
        <div class="flex flex-col items-center">
          <span
            class="bg-brand-accent mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
            :class="index > 0 && 'bg-theme-muted'"
          />
          <span
            v-if="index < entries.length - 1"
            class="bg-theme-muted mt-1 w-px flex-1"
          />
        </div>
        <div class="min-w-0 pb-1">
          <div class="flex flex-wrap items-center gap-2">
            <UiBadge :variant="orderStatusVariant(entry.toStatus)" class="normal-case">
              {{ formatOrderStatus(entry.toStatus) }}
            </UiBadge>
            <span class="text-theme-muted text-xs">
              {{ formatAdminDateTime(entry.createdAt) }}
            </span>
          </div>
          <p v-if="entry.note" class="text-theme-muted mt-1 text-sm">
            {{ entry.note }}
          </p>
        </div>
      </li>
    </ol>
  </section>
</template>

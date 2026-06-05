<script setup lang="ts">
import type { AdminNavIconName } from '~/constants/admin-nav'

defineProps<{
  name: AdminNavIconName
}>()
</script>

<template>
  <svg
    class="h-5 w-5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    aria-hidden="true"
  >
    <path
      v-if="name === 'dashboard'"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4 11h6V4H4v7Zm10 9h6v-7h-6v7ZM4 20h6v-5H4v5Zm10-9h6V4h-6v7Z"
    />
    <path
      v-else-if="name === 'catalog'"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m7.5 7.5 9 5-9 5v-10ZM4 6v12a2 2 0 0 0 2 2h12V4H6a2 2 0 0 0-2 2Z"
    />
    <path
      v-else-if="name === 'orders'"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9 5H4v14h16V5h-5M9 5l3-3 3 3M9 5v3h6V5"
    />
    <path
      v-else-if="name === 'users'"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 8v-1a3 3 0 0 0-2-2.83M16 3.13a4 4 0 0 1 0 7.75"
    />
    <path
      v-else
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.5-3a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
    />
  </svg>
</template>

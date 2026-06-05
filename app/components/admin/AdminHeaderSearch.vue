<script setup lang="ts">
const query = ref('')

function onSubmit() {
  if (!query.value.trim()) return
}
</script>

<template>
  <form
    class="hidden max-w-md flex-1 md:block"
    role="search"
    @submit.prevent="onSubmit"
  >
    <div class="relative">
      <UiIcon
        name="lucide:search"
        :size="16"
        class="text-admin-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
      />
      <input
        v-model="query"
        type="search"
        placeholder="Buscar en el panel…"
        class="border-admin-line bg-admin-surface text-admin w-full rounded-lg border py-2 pl-10 pr-16 text-sm placeholder:text-admin-muted focus:border-[var(--admin-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
      />
      <kbd
        class="border-admin-line bg-admin-card text-admin-muted pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] sm:inline"
      >
        ⌘K
      </kbd>
    </div>
  </form>
</template>

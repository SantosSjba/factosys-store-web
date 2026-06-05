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
      <svg
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path stroke-linecap="round" d="m20 20-3.5-3.5" />
      </svg>
      <input
        v-model="query"
        type="search"
        placeholder="Buscar en el panel…"
        class="border-admin-line w-full rounded-lg border bg-slate-50 py-2 pl-10 pr-16 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[var(--admin-primary)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
      />
      <kbd
        class="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 sm:inline"
      >
        ⌘K
      </kbd>
    </div>
  </form>
</template>

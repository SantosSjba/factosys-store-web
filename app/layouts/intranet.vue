<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
    <IntranetHeader />
    <main class="flex-1">
      <slot />
    </main>
    <footer
      class="border-t border-violet-100 bg-white py-4 text-center text-xs text-slate-500"
    >
      Factosys Intranet — acceso restringido a personal autorizado
    </footer>
  </div>
</template>

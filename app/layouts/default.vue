<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-500">
      © {{ new Date().getFullYear() }} Factosys Store · Todos los derechos reservados
    </footer>
  </div>
</template>

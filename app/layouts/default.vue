<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
      Factosys Store — integrado con FACTOSYS STORE API
    </footer>
  </div>
</template>

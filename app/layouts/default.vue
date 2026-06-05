<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-theme bg-theme-muted text-theme-muted border-t py-8 text-center text-xs">
      © {{ new Date().getFullYear() }} Factosys Store · Todos los derechos reservados
    </footer>
  </div>
</template>

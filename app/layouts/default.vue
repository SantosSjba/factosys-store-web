<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main-content"
      class="bg-brand-accent focus:ring-brand-accent sr-only fixed left-4 top-4 z-[100] rounded-lg px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:outline-none focus:ring-2"
    >
      Saltar al contenido
    </a>
    <AppHeader />
    <main id="main-content" class="flex-1" tabindex="-1">
      <slot />
    </main>
    <StoreFooter />
    <ClientOnly>
      <StoreWhatsappFab />
      <StoreMobileDock />
    </ClientOnly>
  </div>
</template>

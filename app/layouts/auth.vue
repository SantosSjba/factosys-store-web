<template>
  <div class="bg-theme-muted flex min-h-screen flex-col">
    <div class="mx-auto w-full max-w-md px-4 pt-6 sm:pt-8">
      <div class="mb-4 flex items-center justify-between gap-4">
        <BrandLogo size="sm" />
        <NuxtLink
          to="/"
          class="text-theme-muted hover:text-theme inline-flex items-center gap-2 text-sm font-medium transition"
        >
          <UiIcon name="lucide:arrow-left" :size="16" />
          <span class="hidden sm:inline">Volver a la tienda</span>
          <span class="sm:hidden">Volver</span>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-1 items-center justify-center px-4 py-6 sm:py-8">
      <slot />
    </div>
  </div>
</template>

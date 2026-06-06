<template>
  <div class="flex min-h-screen flex-col bg-slate-100">
    <div class="mx-auto w-full max-w-md px-4 pt-6">
      <NuxtLink
        to="/"
        class="text-theme-muted hover:text-theme inline-flex items-center gap-2 text-sm font-medium transition"
      >
        <UiIcon name="lucide:arrow-left" :size="16" />
        Volver a la tienda
      </NuxtLink>
    </div>
    <div class="flex flex-1 items-center justify-center px-4 py-8">
      <slot />
    </div>
  </div>
</template>

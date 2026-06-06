<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <UiToastContainer />
    <UiLoadingOverlay />
    <UiConfirmHost />
  </ClientOnly>
</template>

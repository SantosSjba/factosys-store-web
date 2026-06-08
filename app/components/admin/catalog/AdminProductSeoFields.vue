<script setup lang="ts">
// Campos SEO enlazados al formulario vee-validate del producto.
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <UiFormField
      name="metaTitle"
      label="Meta título"
      class="sm:col-span-2"
      autocomplete="off"
    />
    <UiFormField
      name="metaDescription"
      label="Meta descripción"
      class="sm:col-span-2"
      autocomplete="off"
    />
    <UiFormField
      name="tagsText"
      label="Etiquetas"
      class="sm:col-span-2"
      hint="Separadas por coma. Ej: gaming, oferta, nuevo"
      autocomplete="off"
    />
  </div>
</template>

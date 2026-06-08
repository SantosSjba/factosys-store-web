<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <UiFormField
      name="email"
      label="Correo electrónico"
      type="email"
      autocomplete="off"
      required
    />
    <UiFormField
      name="password"
      label="Contraseña temporal"
      type="password"
      autocomplete="new-password"
      hint="Mínimo 8 caracteres"
      required
    />
    <UiFormField name="firstName" label="Nombre" autocomplete="off" />
    <UiFormField name="lastName" label="Apellido" autocomplete="off" />
    <div class="sm:col-span-2">
      <UiFormField
        name="phone"
        label="Teléfono"
        type="tel"
        autocomplete="off"
      />
    </div>
  </div>
</template>

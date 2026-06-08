<template>
  <div class="space-y-5">
    <AdminFormSection
      title="Acceso"
      description="Credenciales para iniciar sesión en el sistema."
      icon="lucide:lock-keyhole"
    >
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
      </div>
    </AdminFormSection>

    <AdminFormSection
      title="Perfil"
      description="Datos personales de contacto."
      icon="lucide:user"
    >
      <div class="grid gap-4 sm:grid-cols-2">
        <UiFormField name="firstName" label="Nombre" autocomplete="off" />
        <UiFormField name="lastName" label="Apellido" autocomplete="off" />
        <UiFormField
          name="phone"
          label="Teléfono"
          type="tel"
          class="sm:col-span-2"
          autocomplete="off"
        />
      </div>
    </AdminFormSection>
  </div>
</template>

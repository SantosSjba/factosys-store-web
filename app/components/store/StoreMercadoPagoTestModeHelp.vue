<template>
  <div
    class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
  >
    <p class="font-medium">Modo prueba de Mercado Pago</p>
    <ul class="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
      <li>
        El correo de pago es <strong>test@testuser.com</strong> (lo aplicamos
        automáticamente; no uses tu correo real en el formulario de tarjeta).
      </li>
      <li>
        En <code>.env</code> deben estar las credenciales de la pestaña
        <strong>Prueba</strong> de Mercado Pago (no las de producción).
      </li>
      <li>
        Tarjeta de prueba: <strong>5031 7557 3453 0604</strong> · CVV
        <strong>123</strong> · vence <strong>11/30</strong>.
      </li>
      <li>
        Titular para pago aprobado: nombre <strong>APRO</strong> · DNI
        <strong>123456789</strong>.
      </li>
    </ul>
  </div>
</template>

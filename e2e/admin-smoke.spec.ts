import { expect, test } from '@playwright/test'

test.describe('Admin intranet smoke', () => {
  test('login page carga', async ({ page }) => {
    await page.goto('/intranet/login')
    await expect(page.getByRole('heading', { name: /intranet/i })).toBeVisible()
  })

  test('dashboard redirige a login sin sesión', async ({ page }) => {
    await page.goto('/intranet')
    await expect(page).toHaveURL(/\/intranet\/login/)
  })

  test('pedidos redirige a login sin sesión', async ({ page }) => {
    await page.goto('/intranet/pedidos')
    await expect(page).toHaveURL(/\/intranet\/login/)
  })

  test('configuración redirige a login sin sesión', async ({ page }) => {
    await page.goto('/intranet/configuracion')
    await expect(page).toHaveURL(/\/intranet\/login/)
  })
})

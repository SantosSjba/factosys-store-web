/**
 * Paleta Factosys Store — derivada del logo corporativo.
 * @see app/assets/css/main.css (CSS variables)
 * @see tailwind.config.ts (clases Tailwind)
 */
export const brandColors = {
  cyan: '#00C8E8',
  cyanBright: '#00E5FF',
  cyanDark: '#0096B4',
  cyanDarker: '#007A94',
  silver: '#B8C8D4',
  silverLight: '#D8E2EA',
  ink: '#0A0F14',
  inkSoft: '#1A2332',
} as const

export const storeColors = {
  surface: '#FFFFFF',
  muted: '#F4F7F9',
  border: '#DDE4EA',
  promo: '#E8F9FD',
  promoText: '#006B82',
  text: '#0F172A',
  textMuted: '#64748B',
} as const

export const brandAssets = {
  logo: '/brand/logo-factosys.png',
} as const

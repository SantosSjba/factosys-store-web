/**
 * Referencia a variables CSS globales (tokens.css).
 * No duplicar hex aquí — editar solo tokens.css.
 */
export const cssVar = {
  brandCyan: '--brand-cyan',
  brandCyanBright: '--brand-cyan-bright',
  brandCyanDark: '--brand-cyan-dark',
  brandCyanDarker: '--brand-cyan-darker',
  brandFactoText: '--brand-facto-text',
  brandSilver: '--brand-silver',
  brandInk: '--brand-ink',
  brandInkSoft: '--brand-ink-soft',
  storeSurface: '--store-surface',
  storeMuted: '--store-muted',
  storeBorder: '--store-border',
  storePromo: '--store-promo',
  storePromoText: '--store-promo-text',
  storeText: '--store-text',
  colorPrimary: '--color-primary',
  colorLink: '--color-link',
} as const

/** Devuelve `var(--nombre-variable)` para estilos inline o charts. */
export function v(name: keyof typeof cssVar): string {
  return `var(${cssVar[name]})`
}

export const brandAssets = {
  logo: '/brand/logo-factosys.png',
} as const

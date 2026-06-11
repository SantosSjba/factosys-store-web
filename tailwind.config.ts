import typography from '@tailwindcss/typography'

/**
 * Tailwind — layout y utilidades estándar.
 * La paleta de colores vive en app/assets/css/tokens.css (variables CSS globales).
 */
export default {
  plugins: [typography],
  safelist: [
    'text-brand-facto',
    'text-brand-sys',
    'text-brand-accent',
    'text-brand-accent-deep',
    'bg-brand-accent',
    'bg-brand-accent-soft',
    'bg-brand-ink-btn',
    'bg-store-promo-bar',
    'text-store-promo-bar',
    'border-store-promo-bar',
    'border-store-line',
    'bg-store-subnav',
    'hover:text-brand-accent',
    'border-brand-cyan-focus',
    'shadow-brand-glow',
    'bg-admin-sidebar',
    'bg-admin-surface',
    'bg-admin-card',
    'text-admin-accent',
    'border-admin-line',
    'bg-theme-surface',
    'bg-theme-muted',
    'bg-theme-header',
    'bg-theme-dropdown',
    'text-theme',
    'text-theme-muted',
    'border-theme',
    'hover:bg-theme-muted',
    'hover:text-theme',
    'text-admin',
    'text-admin-muted',
    'lg:pl-20',
    'lg:pl-[17rem]',
  ],
}

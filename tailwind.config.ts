import type { Config } from 'tailwindcss'

/**
 * Paleta Factosys Store — derivada del logo corporativo.
 * Cian eléctrico (SYS / UFO) + plata fría (FACTO) + negro profundo (fondo logo).
 */
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#00C8E8',
          'cyan-bright': '#00E5FF',
          'cyan-dark': '#0096B4',
          'cyan-darker': '#007A94',
          silver: '#B8C8D4',
          'silver-light': '#D8E2EA',
          ink: '#0A0F14',
          'ink-soft': '#1A2332',
        },
        store: {
          surface: '#FFFFFF',
          muted: '#F4F7F9',
          border: '#DDE4EA',
          promo: '#E8F9FD',
          'promo-text': '#006B82',
          text: '#0F172A',
          'text-muted': '#64748B',
        },
      },
      boxShadow: {
        'brand-glow': '0 0 20px rgb(0 200 232 / 0.35)',
      },
    },
  },
} satisfies Config

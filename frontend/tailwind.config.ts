import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface:    '#111118',
        border:     '#1e1e2e',
        'neon-cyan':   '#00f5ff',
        'neon-green':  '#39ff14',
        'neon-purple': '#bf00ff',
        'neon-orange': '#ff6600',
        text:   '#e2e8f0',
        muted:  '#64748b',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan':   '0 0 12px rgba(0, 245, 255, 0.4)',
        'glow-green':  '0 0 12px rgba(57, 255, 20, 0.4)',
        'glow-purple': '0 0 12px rgba(191, 0, 255, 0.4)',
        'glow-orange': '0 0 12px rgba(255, 102, 0, 0.4)',
      },
      borderColor: {
        DEFAULT: '#1e1e2e',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

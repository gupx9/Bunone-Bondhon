import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5EBD7',
        ivory: '#FFF8EF',
        gold: '#D9A520',
        maroon: '#7A1F1F',
        brown: '#3B2416',
        terracotta: '#C96B2C',
        line: '#E5D3B3'
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        bengali: ['var(--font-bengali)']
      },
      boxShadow: {
        bloom: '0 18px 50px rgba(59, 36, 22, 0.12)',
        glow: '0 0 0 1px rgba(217, 165, 32, 0.18), 0 18px 45px rgba(217, 165, 32, 0.14)'
      },
      backgroundImage: {
        'warm-radial': 'radial-gradient(circle at top, rgba(217,165,32,0.18), transparent 38%), radial-gradient(circle at 80% 10%, rgba(122,31,31,0.14), transparent 24%), linear-gradient(180deg, #F5EBD7 0%, #F8EFDC 100%)'
      }
    }
  },
  plugins: []
};

export default config;
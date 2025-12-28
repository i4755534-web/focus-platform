import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '4xl': '3840px', // 4K displays
        '3xl': '2560px', // Ultra-wide displays
      },
      fontSize: {
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      colors: {
        // Nebula Design System Colors
        nebula: {
          primary: 'var(--nebula-primary)',
          secondary: 'var(--nebula-secondary)',
          accent: 'var(--nebula-accent)',
          background: 'var(--nebula-background)',
          surface: 'var(--nebula-surface)',
          text: 'var(--nebula-text)',
          'text-secondary': 'var(--nebula-text-secondary)',
          border: 'var(--nebula-border)',
          error: 'var(--nebula-error)',
          success: 'var(--nebula-success)',
          warning: 'var(--nebula-warning)',
          info: 'var(--nebula-info)',
        },
        // Cyberpunk Colors
        cyber: {
          fuchsia: '#FF00FF',
          electric: '#00FFFF',
          neon: '#39FF14',
          matrix: '#00FF41',
          purple: '#8A2BE2',
          pink: '#FF1493',
        },
        // Mood-based gradients
        mood: {
          dawn: {
            start: '#FFE4B5',
            end: '#FFA500',
          },
          day: {
            start: '#87CEEB',
            end: '#00BFFF',
          },
          dusk: {
            start: '#FF6347',
            end: '#DC143C',
          },
          night: {
            start: '#191970',
            end: '#000080',
          },
        },
      },
      fontFamily: {
        'nebula': ['var(--font-nebula)', 'SF Pro Display', 'system-ui', 'sans-serif'],
        'nebula-fluid': ['var(--font-nebula-fluid)', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      animation: {
        'liquid-flow': 'liquid-flow 3s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'parallax-float': 'parallax-float 6s ease-in-out infinite',
        'hologram': 'hologram 4s linear infinite',
        'cyber-grid': 'cyber-grid 20s linear infinite',
        'avatar-glow': 'avatar-glow 3s ease-in-out infinite',
        'message-depth': 'message-depth 0.3s ease-out',
        'wave-visualize': 'wave-visualize 2s ease-in-out infinite',
      },
      keyframes: {
        'liquid-flow': {
          '0%, 100%': { transform: 'translateX(0%) translateY(0%) scale(1)' },
          '25%': { transform: 'translateX(5%) translateY(-2%) scale(1.02)' },
          '50%': { transform: 'translateX(-3%) translateY(3%) scale(0.98)' },
          '75%': { transform: 'translateX(2%) translateY(-1%) scale(1.01)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'parallax-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-0.5deg)' },
        },
        'hologram': {
          '0%': { transform: 'translateZ(0px) rotateX(0deg)' },
          '25%': { transform: 'translateZ(20px) rotateX(5deg)' },
          '50%': { transform: 'translateZ(40px) rotateX(0deg)' },
          '75%': { transform: 'translateZ(20px) rotateX(-5deg)' },
          '100%': { transform: 'translateZ(0px) rotateX(0deg)' },
        },
        'cyber-grid': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        'avatar-glow': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'message-depth': {
          '0%': { transform: 'translateY(0) scale(1)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
          '100%': { transform: 'translateY(-2px) scale(1.02)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
        },
        'wave-visualize': {
          '0%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1.5)' },
          '100%': { transform: 'scaleY(0.5)' },
        },
      },
      boxShadow: {
        '3d': '0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.1)',
        '3d-hover': '0 8px 16px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'neon-strong': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};

export default config;
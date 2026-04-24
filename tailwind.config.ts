import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(214 32% 91%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222 47% 11%)',
        muted: 'hsl(210 40% 96%)',
        primary: {
          DEFAULT: 'hsl(222 47% 11%)',
          foreground: 'hsl(210 40% 98%)',
        },
      },
      boxShadow: {
        card: '0 8px 30px rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;

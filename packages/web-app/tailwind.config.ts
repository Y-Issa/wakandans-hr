import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          green: '#16A34A',
          greenLight: '#DCFCE7',
          blue: '#3B82F6',
          blueLight: '#DBEAFE',
          pink: '#EC4899',
          pinkLight: '#FCE7F3',
          ink: '#111827',
          canvas: '#F5F6F8',
        },
      },
    },
  },
  plugins: [],
};
export default config;

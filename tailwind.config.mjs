/** @type {import('tailwindcss').Config} */
const config = {
  // Content paths for Tailwind to scan for class usage
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#080809',
          surface: '#0F0F12',
          elevated: '#17171C',
        },
        text: {
          primary: '#F2F0EB',
          secondary: '#8A8880',
          tertiary: '#4A4845',
        },
        accent: {
          dev: '#7C6FF7',
          devdim: 'rgba(124,111,247,0.08)',
          photo: '#E8935A',
          photodim: 'rgba(232,147,90,0.08)',
        },
        border: {
          subtle: 'rgba(255,255,255,0.08)',
          hover: 'rgba(255,255,255,0.16)',
        },
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '999px',
      },
    },
  },
};

export default config;

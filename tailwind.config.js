const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { bg: v('bg'), fg: v('fg'), card: v('card'), muted: v('muted'), line: v('line'), primary: v('primary'), accent: v('accent'), onp: v('onp') },
      fontFamily: { display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'], sans: ['Figtree', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};

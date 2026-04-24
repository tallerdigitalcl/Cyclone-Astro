/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',
        secondary: 'var(--color-secondary)',
        'secondary-dark': 'var(--color-secondary-dark)',
        'secondary-light': 'var(--color-secondary-light)',
        accent: 'var(--color-accent)',
        button: 'var(--color-button)',
        text: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        surface: 'var(--color-bg-alt)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      fontSize: {
        h1: ['var(--text-h1)', { lineHeight: 'var(--leading-display)', letterSpacing: '-0.04em' }],
        h2: ['var(--text-h2)', { lineHeight: 'var(--leading-heading)', letterSpacing: '-0.035em' }],
        h3: ['var(--text-h3)', { lineHeight: 'var(--leading-subheading)', letterSpacing: '-0.03em' }],
        h4: ['var(--text-h4)', { lineHeight: 'var(--leading-subheading)', letterSpacing: '-0.025em' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: 'var(--leading-body)' }],
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        'body-sm': ['var(--text-body-sm)', { lineHeight: 'var(--leading-compact)' }],
        button: ['var(--text-button)', { lineHeight: '1.2', letterSpacing: '0.02em' }],
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
    },
  },
  plugins: [],
};

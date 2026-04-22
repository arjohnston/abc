export const FontSize = {
  h1:   'clamp(2.5rem, 7vw, 4.5rem)',
  h2:   'clamp(1.4rem, 4vw, 2rem)',
  h3:   'clamp(1rem, 3vw, 1.5rem)',
  body: '1rem',
  sm:   '0.9rem',
} as const

export const FontWeight = {
  regular:  400,
  semibold: 600,
  bold:     700,
  black:    900,
} as const

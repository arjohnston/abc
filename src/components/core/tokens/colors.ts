export const Colors = {
  green:     '#58cc02',
  greenDark: '#46a302',
  blue:      '#1cb0f6',
  blueDark:  '#1899d6',
  purple:    '#ce82ff',
  purpleDark:'#a855f7',
  orange:    '#ff9600',
  orangeDark:'#e08600',
  red:       '#ff4b4b',
  redDark:   '#ea2b2b',
  yellow:    '#ffc800',
  yellowDark:'#e0b000',
  bg:        '#131f24',
  bgCard:    '#1a2c33',
  bgLight:   '#235264',
  text:      '#ffffff',
  textMuted: '#96b0bc',
} as const

export type ColorToken = keyof typeof Colors

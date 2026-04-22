import './CoreText.css'

import type React from 'react'

type TextSize = 'h1' | 'h2' | 'h3' | 'body' | 'sm'

export type TextColor =
  | 'default'
  | 'muted'
  | 'green'
  | 'blue'
  | 'purple'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'game'

const COLOR_MAP: Record<TextColor, string> = {
  default:  'var(--text)',
  muted:    'var(--text-muted)',
  green:    'var(--green)',
  blue:     'var(--blue)',
  purple:   'var(--purple)',
  orange:   'var(--orange)',
  red:      'var(--red)',
  yellow:   'var(--yellow)',
  game:     'var(--game-color)',
}

interface CoreTextProps {
  size?: TextSize
  color?: TextColor
  align?: 'left' | 'center' | 'right'
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const TAG_MAP: Record<TextSize, string> = { h1: 'h1', h2: 'h2', h3: 'h3', body: 'p', sm: 'span' }

export function CoreText({ size = 'body', color, align, className, style, children }: CoreTextProps) {
  const Tag = TAG_MAP[size] as keyof React.JSX.IntrinsicElements
  const resolvedColor = color && color !== 'default' ? COLOR_MAP[color] : undefined

  return (
    <Tag
      className={['core-text', `core-text--${size}`, className].filter(Boolean).join(' ')}
      style={{ color: resolvedColor, textAlign: align, ...style }}
    >
      {children}
    </Tag>
  )
}

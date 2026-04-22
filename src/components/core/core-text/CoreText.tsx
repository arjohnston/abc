import './CoreText.css'

import { createElement, forwardRef } from 'react'
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
  default: 'var(--text)',
  muted:   'var(--text-muted)',
  green:   'var(--green)',
  blue:    'var(--blue)',
  purple:  'var(--purple)',
  orange:  'var(--orange)',
  red:     'var(--red)',
  yellow:  'var(--yellow)',
  game:    'var(--game-color)',
}

const TAG_MAP: Record<TextSize, string> = {
  h1: 'h1', h2: 'h2', h3: 'h3', body: 'p', sm: 'span',
}

export interface CoreTextProps extends React.HTMLAttributes<HTMLElement> {
  size?: TextSize
  color?: TextColor
  align?: 'left' | 'center' | 'right'
}

// createElement avoids the JSX intrinsic element union that makes TypeScript
// fail to resolve the ref type for a dynamically-chosen tag.
export const CoreText = forwardRef<HTMLElement, CoreTextProps>(
  ({ size = 'body', color, align, className, style, children, ...rest }, ref) => {
    const resolvedColor = color && color !== 'default' ? COLOR_MAP[color] : undefined

    return createElement(
      TAG_MAP[size],
      {
        ref,
        className: ['core-text', `core-text--${size}`, className].filter(Boolean).join(' '),
        style: { color: resolvedColor, textAlign: align, ...style },
        ...rest,
      },
      children,
    )
  },
)

CoreText.displayName = 'CoreText'

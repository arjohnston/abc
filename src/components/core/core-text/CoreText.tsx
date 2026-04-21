import './CoreText.css'

import type React from 'react'

interface CoreTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'label'
  variant?: 'heading' | 'subheading' | 'body' | 'muted' | 'label'
  size?: number
  weight?: number
  color?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  children?: React.ReactNode
}

export function CoreText({ as: Tag = 'p', variant, size, weight, color, align, className, children }: CoreTextProps) {
  return (
    <Tag
      className={['core-text', variant && `core-text--${variant}`, className].filter(Boolean).join(' ')}
      style={{ fontSize: size, fontWeight: weight, color, textAlign: align }}
    >
      {children}
    </Tag>
  )
}

import './CoreText.css'

import type React from 'react'

type SemanticSize = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'label'

interface CoreTextProps {
  size?: SemanticSize | number
  variant?: 'heading' | 'subheading' | 'body' | 'muted' | 'label'
  weight?: number
  color?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  children?: React.ReactNode
}

const SEMANTIC_SIZES: ReadonlySet<string> = new Set(['h1', 'h2', 'h3', 'p', 'span', 'label'])

export function CoreText({ size, variant, weight, color, align, className, children }: CoreTextProps) {
  const isSemantic = typeof size === 'string' && SEMANTIC_SIZES.has(size)
  const Tag = (isSemantic ? size as SemanticSize : 'p')
  const inlineSize = typeof size === 'number' ? size : undefined
  const sizeClass = isSemantic ? `core-text--${size}` : undefined

  return (
    <Tag
      className={['core-text', sizeClass, variant && `core-text--${variant}`, className].filter(Boolean).join(' ')}
      style={{ fontSize: inlineSize, fontWeight: weight, color, textAlign: align }}
    >
      {children}
    </Tag>
  )
}

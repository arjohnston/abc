// Compound component pattern — intentionally exports multiple named forwardRef components
/* eslint-disable react-refresh/only-export-components */
import './CoreCard.css'

import type React from 'react'
import { forwardRef } from 'react'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export interface CoreCardProps extends SharedLayoutProps {
  as?: React.ElementType
}

const CoreCardBase = forwardRef<HTMLElement, CoreCardProps>(
  ({ as: Tag = 'div', className, children, ...rest }, ref) => (
    <Tag
      ref={ref}
      className={['core-card', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </Tag>
  ),
)

CoreCardBase.displayName = 'CoreCard'

// ─── Sub-parts ────────────────────────────────────────────

const Header = forwardRef<HTMLDivElement, SharedLayoutProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={['core-card__header', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  ),
)
Header.displayName = 'CoreCard.Header'

const Body = forwardRef<HTMLDivElement, SharedLayoutProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={['core-card__body', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  ),
)
Body.displayName = 'CoreCard.Body'

const Footer = forwardRef<HTMLDivElement, SharedLayoutProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={['core-card__footer', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  ),
)
Footer.displayName = 'CoreCard.Footer'

export const CoreCard = Object.assign(CoreCardBase, { Header, Body, Footer })

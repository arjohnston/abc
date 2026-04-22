import './CoreRow.css'

import { forwardRef } from 'react'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export interface CoreRowProps extends SharedLayoutProps {
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  wrap?: boolean
}

export const CoreRow = forwardRef<HTMLDivElement, CoreRowProps>(
  ({ align, justify, wrap, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={['core-row', wrap && 'core-row--wrap', className].filter(Boolean).join(' ')}
      style={{ alignItems: align, justifyContent: justify, ...buildSpacingStyle(rest) }}
    >
      {children}
    </div>
  ),
)

CoreRow.displayName = 'CoreRow'

import './CoreBox.css'

import { forwardRef } from 'react'
import type React from 'react'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export interface CoreBoxProps extends SharedLayoutProps {
  as?: React.ElementType
}

export const CoreBox = forwardRef<HTMLElement, CoreBoxProps>(
  ({ as: Tag = 'div', className, children, ...rest }, ref) => (
    <Tag
      ref={ref}
      className={['core-box', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </Tag>
  ),
)

CoreBox.displayName = 'CoreBox'

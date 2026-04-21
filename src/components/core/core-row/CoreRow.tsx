import './CoreRow.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreRowProps extends SharedLayoutProps {
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  wrap?: boolean
}

export function CoreRow({ align, justify, wrap, className, children, ...rest }: CoreRowProps) {
  return (
    <div
      className={['core-row', wrap && 'core-row--wrap', className].filter(Boolean).join(' ')}
      style={{ alignItems: align, justifyContent: justify, ...buildSpacingStyle(rest) }}
    >
      {children}
    </div>
  )
}

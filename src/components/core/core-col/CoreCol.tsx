import './CoreCol.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreColProps extends SharedLayoutProps {
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
}

export function CoreCol({ align, justify, className, children, ...rest }: CoreColProps) {
  return (
    <div
      className={['core-col', className].filter(Boolean).join(' ')}
      style={{ alignItems: align, justifyContent: justify, ...buildSpacingStyle(rest) }}
    >
      {children}
    </div>
  )
}

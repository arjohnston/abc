import './CoreScrollView.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreScrollViewProps extends SharedLayoutProps {
  horizontal?: boolean
}

export function CoreScrollView({ horizontal, className, children, ...rest }: CoreScrollViewProps) {
  return (
    <div
      className={['core-scroll-view', horizontal && 'core-scroll-view--horizontal', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  )
}

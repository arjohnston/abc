import './CoreBox.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreBoxProps extends SharedLayoutProps {
  as?: 'div' | 'section' | 'article' | 'main' | 'nav'
}

export function CoreBox({ as: Tag = 'div', className, children, ...rest }: CoreBoxProps) {
  return (
    <Tag
      className={['core-box', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </Tag>
  )
}

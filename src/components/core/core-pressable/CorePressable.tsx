import './CorePressable.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CorePressableProps extends SharedLayoutProps {
  onClick?: () => void
  disabled?: boolean
}

export function CorePressable({ onClick, disabled, className, children, ...rest }: CorePressableProps) {
  return (
    <div
      className={['core-pressable', disabled && 'core-pressable--disabled', className].filter(Boolean).join(' ')}
      onClick={disabled ? undefined : onClick}
      style={buildSpacingStyle(rest)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {children}
    </div>
  )
}

import './CorePressable.css'

import type React from 'react'
import { forwardRef } from 'react'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

// 'htmlType' is the remapped form of the native button 'type' attribute,
// preventing accidental collision when spreading props onto a <button>.
export interface CorePressableProps extends SharedLayoutProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>
  onPointerUp?: React.PointerEventHandler<HTMLButtonElement>
  disabled?: boolean
  htmlType?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'data-tooltip'?: string
  tabIndex?: number
}

export const CorePressable = forwardRef<HTMLButtonElement, CorePressableProps>(
  (
    {
      htmlType = 'button',
      className,
      children,
      onClick,
      onPointerDown,
      onPointerUp,
      disabled,
      tabIndex,
      ...rest
    },
    ref,
  ) => {
    if (import.meta.env.DEV && disabled && !onClick && !onPointerDown) {
      console.warn(
        '[CorePressable] `disabled` is set but no click handler is provided. The button will be disabled but has no action.',
      )
    }

    const {
      'aria-label': ariaLabel,
      'aria-expanded': ariaExpanded,
      'aria-pressed': ariaPressed,
      'data-tooltip': dataTooltip,
      ...spacingProps
    } = rest

    return (
      <button
        ref={ref}
        type={htmlType}
        className={['core-pressable', className].filter(Boolean).join(' ')}
        style={buildSpacingStyle(spacingProps)}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        disabled={disabled}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
        data-tooltip={dataTooltip}
      >
        {children}
      </button>
    )
  },
)

CorePressable.displayName = 'CorePressable'

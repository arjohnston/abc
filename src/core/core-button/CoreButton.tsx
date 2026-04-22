import './CoreButton.css'

import type React from 'react'
import { forwardRef } from 'react'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

// 'htmlType' remaps the native button 'type' attribute to avoid prop-spread collisions.
export interface CoreButtonProps extends SharedLayoutProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>
  onPointerUp?: React.PointerEventHandler<HTMLButtonElement>
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  htmlType?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'data-tooltip'?: string
  tabIndex?: number
}

export const CoreButton = forwardRef<HTMLButtonElement, CoreButtonProps>(
  (
    {
      htmlType = 'button',
      variant,
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
      console.warn('[CoreButton] `disabled` is set but no click handler is provided.')
    }

    const {
      'aria-label': ariaLabel,
      'aria-expanded': ariaExpanded,
      'aria-pressed': ariaPressed,
      'data-tooltip': dataTooltip,
      ...spacingProps
    } = rest

    const cls = ['core-btn', variant && `core-btn--${variant}`, className].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        type={htmlType}
        className={cls}
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

CoreButton.displayName = 'CoreButton'

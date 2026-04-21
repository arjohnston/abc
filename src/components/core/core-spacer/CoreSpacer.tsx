import './CoreSpacer.css'

import type React from 'react'

interface CoreSpacerProps {
  size?: number
}

export function CoreSpacer({ size }: CoreSpacerProps) {
  const style: React.CSSProperties = size !== undefined
    ? { width: size, height: size, flex: 'none' }
    : {}
  return <div className="core-spacer" style={style} />
}

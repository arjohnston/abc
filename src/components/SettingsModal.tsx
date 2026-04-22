import './SettingsModal.css'

import { useState } from 'react'

import { CoreCol, CoreRow, CoreText } from '@core'

import { Toggle } from './ui/Toggle'

interface SettingsModalProps {
  isRandom: boolean
  onToggleRandom: () => void
  onReset: () => void
  onClose: () => void
}

export function SettingsModal({ isRandom, onToggleRandom, onReset, onClose }: SettingsModalProps) {
  const [confirming, setConfirming] = useState(false)

  const handleReset = () => {
    onReset()
    setConfirming(false)
    onClose()
  }

  return (
    <div className="settings-backdrop" onPointerDown={onClose}>
      <div className="settings-modal" onPointerDown={(e) => e.stopPropagation()}>
        <CoreRow align="center" justify="space-between">
          <CoreText size="h2">Settings</CoreText>
          <button className="settings-close" onClick={onClose}>✕</button>
        </CoreRow>

        <hr className="settings-divider" />

        <CoreRow align="center" justify="space-between" gap={16}>
          <CoreText size="h3">🎲 Random Order</CoreText>
          <Toggle active={isRandom} label="" onToggle={onToggleRandom} />
        </CoreRow>

        <hr className="settings-divider" />

        {confirming ? (
          <CoreCol gap={10}>
            <CoreText size="sm" color="muted" align="center">This will erase all stars and progress. Are you sure?</CoreText>
            <CoreRow gap={10} className="settings-confirm-btns">
              <button className="settings-confirm-yes" onClick={handleReset}>Yes, reset</button>
              <button className="settings-confirm-no" onClick={() => setConfirming(false)}>Cancel</button>
            </CoreRow>
          </CoreCol>
        ) : (
          <button className="settings-reset-btn" onClick={() => setConfirming(true)}>
            🗑️ Reset Game
          </button>
        )}
      </div>
    </div>
  )
}

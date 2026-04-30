import './SettingsModal.css'

import { CoreButton, CoreCol, CoreRow, CoreText, CoreToggle, Spacing } from '@core'
import { useState } from 'react'

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
          <CoreButton className="settings-close" onClick={onClose} aria-label="Close settings">
            ✕
          </CoreButton>
        </CoreRow>

        <hr className="settings-divider" />

        <CoreRow align="center" justify="space-between" gap={Spacing.md}>
          <CoreText size="h3">🎲 Random Order</CoreText>
          <CoreToggle active={isRandom} label="" onToggle={onToggleRandom} />
        </CoreRow>

        <hr className="settings-divider" />

        {confirming ? (
          <CoreCol gap={10}>
            <CoreText size="sm" color="muted" align="center">
              This will erase all stars and progress. Are you sure?
            </CoreText>
            <CoreRow gap={10}>
              <CoreButton className="settings-confirm-yes" onClick={handleReset}>
                Yes, reset
              </CoreButton>
              <CoreButton className="settings-confirm-no" onClick={() => setConfirming(false)}>
                Cancel
              </CoreButton>
            </CoreRow>
          </CoreCol>
        ) : (
          <CoreButton className="settings-reset-btn" onClick={() => setConfirming(true)}>
            🗑️ Reset Game
          </CoreButton>
        )}

        <CoreText size="sm" color="muted" align="center" style={{ fontSize: '11px' }}>
          {__APP_VERSION__}
        </CoreText>
      </div>
    </div>
  )
}

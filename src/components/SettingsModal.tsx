import './SettingsModal.css'

import { useState } from 'react'

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
        <div className="settings-header">
          <span className="settings-title">Settings</span>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        <hr className="settings-divider" />

        <div className="settings-row">
          <span className="settings-row-label">🎲 Random Order</span>
          <Toggle active={isRandom} label="" onToggle={onToggleRandom} />
        </div>

        <hr className="settings-divider" />

        {confirming ? (
          <div className="settings-confirm">
            <p className="settings-confirm-text">This will erase all stars and progress. Are you sure?</p>
            <div className="settings-confirm-btns">
              <button className="settings-confirm-yes" onClick={handleReset}>Yes, reset</button>
              <button className="settings-confirm-no" onClick={() => setConfirming(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="settings-reset-btn" onClick={() => setConfirming(true)}>
            🗑️ Reset Game
          </button>
        )}
      </div>
    </div>
  )
}

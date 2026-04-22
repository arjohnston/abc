import './GamePreviewModal.css'

import type { GameConfig } from '@common/types/game'
import { CoreRow, CoreText, Spacing } from '@core'
import { useEffect, useRef } from 'react'

interface GamePreviewModalProps {
  game: GameConfig
  stars: number
  onPlay: () => void
  onClose: () => void
}

export function GamePreviewModal({ game, stars, onPlay, onClose }: GamePreviewModalProps) {
  // Prevent the synthesized click event (from the tap that opened this modal)
  // from immediately closing it on touch devices.
  const readyRef = useRef(false)
  useEffect(() => {
    const t = setTimeout(() => {
      readyRef.current = true
    }, 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="gpm-backdrop"
      role="button"
      tabIndex={0}
      aria-label="Close preview"
      onClick={(e) => {
        if (e.target === e.currentTarget && readyRef.current) {
          onClose()
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === 'Escape') && readyRef.current) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${game.title} preview`}
        className="gpm-card"
        style={{ '--gpm-color': game.color, '--gpm-dark': game.colorDark } as React.CSSProperties}
      >
        {/* Banner */}
        <div className="gpm-banner">
          <span className="gpm-banner-emoji">{game.emoji}</span>
        </div>

        {/* Info */}
        <div className="gpm-body">
          <CoreText size="h2" style={{ marginBottom: '6px' }}>
            {game.title}
          </CoreText>
          <CoreText size="sm" color="muted" style={{ marginBottom: '14px' }}>
            {game.description}
          </CoreText>
          <CoreRow gap={Spacing.xxs} className="gpm-stars">
            {[1, 2, 3].map((i) => (
              <span key={i} className={`gpm-star ${i <= stars ? 'gpm-star--earned' : ''}`}>
                ★
              </span>
            ))}
          </CoreRow>
        </div>

        {/* Actions */}
        <CoreRow gap={10} className="gpm-actions">
          <button className="gpm-btn gpm-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="gpm-btn gpm-btn--play" onClick={onPlay}>
            Play! →
          </button>
        </CoreRow>
      </div>
    </div>
  )
}

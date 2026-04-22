import './GamePreviewModal.css'

import { useEffect, useRef } from 'react'

import { CoreRow, CoreText } from '@core'

import type { GameConfig } from '../types/game'

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
    const t = setTimeout(() => { readyRef.current = true }, 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="gpm-backdrop" onClick={() => { if (readyRef.current) { onClose() } }}>
      <div
        className="gpm-card"
        style={{ '--gpm-color': game.color, '--gpm-dark': game.colorDark } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="gpm-banner">
          <span className="gpm-banner-emoji">{game.emoji}</span>
        </div>

        {/* Info */}
        <div className="gpm-body">
          <CoreText size="h2" className="gpm-title">{game.title}</CoreText>
          <CoreText size="sm" color="muted" className="gpm-desc">{game.description}</CoreText>
          <CoreRow gap={4} className="gpm-stars">
            {[1, 2, 3].map((i) => (
              <span key={i} className={`gpm-star ${i <= stars ? 'gpm-star--earned' : ''}`}>★</span>
            ))}
          </CoreRow>
        </div>

        {/* Actions */}
        <CoreRow gap={10} className="gpm-actions">
          <button className="gpm-btn gpm-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="gpm-btn gpm-btn--play" onClick={onPlay}>Play! →</button>
        </CoreRow>
      </div>
    </div>
  )
}

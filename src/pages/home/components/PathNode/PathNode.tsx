import './PathNode.css'

import type { GameConfig } from '@common/types/game'
import { CoreText } from '@core'

interface PathNodeProps {
  game: GameConfig
  stars: number
  locked: boolean
  onClick: () => void
}

export function PathNode({ game, stars, locked, onClick }: PathNodeProps) {
  const handleClick = () => {
    if (!locked) {
      onClick()
    }
  }

  return (
    <button
      className={`path-node ${locked ? 'path-node--locked' : ''}`}
      style={
        {
          '--node-color': locked ? 'var(--bg-light)' : game.color,
          '--node-color-dark': locked ? 'var(--bg-light)' : game.colorDark,
        } as React.CSSProperties
      }
      onClick={handleClick}
      disabled={locked}
    >
      <div className="path-node__circle">
        <CoreText size="sm" className="path-node__emoji">
          {locked ? '🔒' : game.emoji}
        </CoreText>
      </div>
      <div className="path-node__label">
        <CoreText size="sm" className="path-node__title">
          {game.title}
        </CoreText>
        <div className="path-node__stars">
          {[1, 2, 3].map((i) => (
            <CoreText
              key={i}
              size="sm"
              className={`path-node__star ${i <= stars ? 'path-node__star--earned' : ''}`}
            >
              ★
            </CoreText>
          ))}
        </div>
      </div>
    </button>
  )
}

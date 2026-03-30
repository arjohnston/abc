import './PathNode.css'

import type { GameConfig } from '../../types/game'

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
        <span className="path-node__emoji">{locked ? '🔒' : game.emoji}</span>
      </div>
      <span className="path-node__title">{game.title}</span>
      <div className="path-node__stars">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`path-node__star ${i <= stars ? 'path-node__star--earned' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    </button>
  )
}

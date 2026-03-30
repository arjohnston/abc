import type { GameConfig } from '../../types/game'
import './GameCard.css'

interface GameCardProps {
  game: GameConfig
  onClick: () => void
}

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <button
      className="game-card"
      style={{
        '--card-color': game.color,
        '--card-color-dark': game.colorDark,
      } as React.CSSProperties}
      onClick={onClick}
    >
      <div className="card-emoji">{game.emoji}</div>
      <h2 className="card-title">{game.title}</h2>
      <p className="card-desc">{game.description}</p>
      <div className="card-start">START</div>
    </button>
  )
}

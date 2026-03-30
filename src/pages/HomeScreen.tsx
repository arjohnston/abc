import type { GameConfig } from '../types/game'
import type { Stats } from '../hooks/useStats'
import { Toggle } from '../components/ui/Toggle'
import { GameCard } from '../components/ui/GameCard'
import './HomeScreen.css'

interface HomeScreenProps {
  games: Record<string, GameConfig>
  isRandom: boolean
  onToggleRandom: () => void
  onSelectGame: (key: string) => void
  stats: Stats
}

export function HomeScreen({ games, isRandom, onToggleRandom, onSelectGame, stats }: HomeScreenProps) {
  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">
          <span className="title-letter" style={{ color: 'var(--green)' }}>A</span>
          <span className="title-letter" style={{ color: 'var(--blue)' }}>B</span>
          <span className="title-letter" style={{ color: 'var(--purple)' }}>C</span>
          <span className="title-dot"> </span>
          <span className="title-letter" style={{ color: 'var(--orange)' }}>1</span>
          <span className="title-letter" style={{ color: 'var(--red)' }}>2</span>
          <span className="title-letter" style={{ color: 'var(--yellow)' }}>3</span>
        </h1>
        <p className="home-subtitle">Pick a game and start learning!</p>
      </header>

      {(stats.totalPlays > 0 || stats.totalCompletions > 0) && (
        <div className="stats-bar">
          <span className="stat">🎮 {stats.totalPlays} played</span>
          <span className="stat">⭐ {stats.totalCompletions} completed</span>
        </div>
      )}

      <div className="toggle-section">
        <Toggle
          active={isRandom}
          label="🎲 Random"
          onToggle={onToggleRandom}
        />
      </div>

      <div className="game-cards">
        {Object.entries(games).map(([key, game]) => (
          <GameCard key={key} game={game} onClick={() => onSelectGame(key)} />
        ))}
      </div>
    </div>
  )
}

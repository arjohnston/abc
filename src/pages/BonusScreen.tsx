import './BonusScreen.css'

import { CoreRow, CoreScreen, CoreText } from '@core'

import { BackButton } from '../components/ui/BackButton'
import { BONUS_GAMES } from '../games/config'

interface PlayGamesScreenProps {
  onBack: () => void
  onPlay: (id: string) => void
}

export function BonusScreen({ onBack, onPlay }: PlayGamesScreenProps) {
  return (
    <CoreScreen className="pg">
      <CoreRow align="center" gap={12} padding={12} paddingHorizontal={16} className="pg-header">
        <BackButton onClick={onBack} />
        <CoreText size="h2" className="pg-title">🎮 Play Games</CoreText>
      </CoreRow>

      <div className="pg-grid">
        {BONUS_GAMES.map(game => (
          <button
            key={game.id}
            className="pg-card"
            style={{ '--card-color': game.color, '--card-dark': game.colorDark } as React.CSSProperties}
            onClick={() => onPlay(game.id)}
          >
            <div className="pg-card-art">
              <span className="pg-card-emoji">{game.emoji}</span>
            </div>
            <div className="pg-card-info">
              <div className="pg-card-title">{game.title}</div>
              <div className="pg-card-desc">{game.description}</div>
            </div>
          </button>
        ))}
      </div>
    </CoreScreen>
  )
}

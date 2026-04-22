import './BonusScreen.css'

import { CoreButton, CoreRow, CoreScreen, CoreText, Spacing } from '@core'
import { BONUS_GAMES } from '@games/config'

interface PlayGamesScreenProps {
  onBack: () => void
  onPlay: (id: string) => void
}

export function BonusScreen({ onBack, onPlay }: PlayGamesScreenProps) {
  return (
    <CoreScreen className="pg">
      <CoreRow align="center" gap={Spacing.sm} padding={Spacing.sm} paddingHorizontal={Spacing.md}>
        <CoreButton variant="ghost" aria-label="Back" onClick={onBack}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </CoreButton>
        <CoreText size="h2">🎮 Play Games</CoreText>
      </CoreRow>

      <div className="pg-grid">
        {BONUS_GAMES.map((game) => (
          <CoreButton
            key={game.id}
            className="pg-card"
            style={
              { '--card-color': game.color, '--card-dark': game.colorDark } as React.CSSProperties
            }
            onClick={() => onPlay(game.id)}
          >
            <div className="pg-card-art">
              <span className="pg-card-emoji">{game.emoji}</span>
            </div>
            <div className="pg-card-info">
              <CoreText size="body" className="pg-card-title">
                {game.title}
              </CoreText>
              <CoreText size="sm" color="muted" className="pg-card-desc">
                {game.description}
              </CoreText>
            </div>
          </CoreButton>
        ))}
      </div>
    </CoreScreen>
  )
}

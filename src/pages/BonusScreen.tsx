import './BonusScreen.css'

import { MINI_GAMES } from '../games/config'
import type { MiniGameEntry } from '../games/config'
import { BackButton } from '../components/ui/BackButton'
import type { Section } from '../types/game'
import { SECTIONS } from '../games/config'

function isMiniGameUnlocked(mg: MiniGameEntry, isSectionUnlocked: (s: Section) => boolean): boolean {
  const isLast = mg.afterSectionIndex >= SECTIONS.length - 1
  if (isLast) return isSectionUnlocked(SECTIONS[mg.afterSectionIndex]!)
  return isSectionUnlocked(SECTIONS[mg.afterSectionIndex + 1]!)
}

interface BonusScreenProps {
  onBack: () => void
  onPlay: (id: string) => void
  isSectionUnlocked: (section: Section) => boolean
}

export function BonusScreen({ onBack, onPlay, isSectionUnlocked }: BonusScreenProps) {
  return (
    <div className="bonus">
      <div className="bonus-header">
        <BackButton onClick={onBack} />
        <h2 className="bonus-title">Bonus Games</h2>
        <span className="bonus-header-emoji">🎁</span>
      </div>

      <p className="bonus-subtitle">Unlock sections to collect bonus games!</p>

      <div className="bonus-grid">
        {MINI_GAMES.map(mg => {
          const unlocked = isMiniGameUnlocked(mg, isSectionUnlocked)
          return (
            <button
              key={mg.id}
              className={`bonus-card ${unlocked ? 'bonus-card--unlocked' : 'bonus-card--locked'}`}
              style={unlocked ? { '--card-color': mg.color, '--card-dark': mg.colorDark } as React.CSSProperties : {}}
              onClick={unlocked ? () => onPlay(mg.id) : undefined}
              disabled={!unlocked}
            >
              {!unlocked && <span className="bonus-card-lock">🔒</span>}
              <div className="bonus-card-emoji">{mg.emoji}</div>
              <div className="bonus-card-name">{mg.title}</div>
              <div className="bonus-card-desc">{mg.description}</div>
              {unlocked && <div className="bonus-card-cta">Play →</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

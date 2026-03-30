import './HomeScreen.css'

import { useEffect, useRef } from 'react'

import { PathNode } from '../components/ui/PathNode'
import { SectionBanner } from '../components/ui/SectionBanner'
import { Toggle } from '../components/ui/Toggle'
import { getGamesForSection, SECTIONS } from '../games/config'
import type { Stats } from '../hooks/useStats'
import type { GameConfig, Section } from '../types/game'

interface HomeScreenProps {
  isRandom: boolean
  onToggleRandom: () => void
  onSelectGame: (game: GameConfig) => void
  stats: Stats
  getStars: (gameId: string) => number
  getTotalStars: () => number
  isSectionUnlocked: (section: Section) => boolean
}

export function HomeScreen({
  isRandom,
  onToggleRandom,
  onSelectGame,
  stats,
  getStars,
  getTotalStars,
  isSectionUnlocked,
}: HomeScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current?.querySelector('.section--active')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const totalStars = getTotalStars()

  return (
    <div className="home" ref={scrollRef}>
      <header className="home-header">
        <h1 className="home-title">
          <span className="title-letter" style={{ color: 'var(--green)' }}>
            A
          </span>
          <span className="title-letter" style={{ color: 'var(--blue)' }}>
            B
          </span>
          <span className="title-letter" style={{ color: 'var(--purple)' }}>
            C
          </span>
          <span className="title-dot"> </span>
          <span className="title-letter" style={{ color: 'var(--orange)' }}>
            1
          </span>
          <span className="title-letter" style={{ color: 'var(--red)' }}>
            2
          </span>
          <span className="title-letter" style={{ color: 'var(--yellow)' }}>
            3
          </span>
        </h1>
        <p className="home-subtitle">Pick a game and start learning!</p>
      </header>

      {(stats.totalPlays > 0 || totalStars > 0) && (
        <div className="stats-bar">
          <span className="stat">🎮 {stats.totalPlays} played</span>
          <span className="stat">⭐ {totalStars} stars</span>
        </div>
      )}

      <div className="toggle-section">
        <Toggle active={isRandom} label="🎲 Random" onToggle={onToggleRandom} />
      </div>

      <div className="path">
        {SECTIONS.map((section) => {
          const games = getGamesForSection(section.id)
          const locked = !isSectionUnlocked(section)
          const sectionStars = games.reduce((sum, g) => sum + getStars(g.id), 0)
          const totalPossible = games.length * 3
          const hasIncomplete = games.some((g) => getStars(g.id) < 3)
          const isActive = !locked && hasIncomplete

          return (
            <div key={section.id} className={`section ${isActive ? 'section--active' : ''}`}>
              <SectionBanner
                section={section}
                earnedStars={sectionStars}
                totalPossibleStars={totalPossible}
                locked={locked}
              />
              <div className="path__nodes">
                {games.map((game, i) => (
                  <div
                    key={game.id}
                    className={`path__node-wrapper ${i % 2 === 0 ? 'path__node--left' : 'path__node--right'}`}
                  >
                    {i > 0 && <div className="path__connector" />}
                    <PathNode
                      game={game}
                      stars={getStars(game.id)}
                      locked={locked}
                      onClick={() => onSelectGame(game)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

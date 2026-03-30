import './HomeScreen.css'

import { useEffect, useRef } from 'react'

import { PathNode } from '../components/ui/PathNode'
import { SectionBanner } from '../components/ui/SectionBanner'
import { Toggle } from '../components/ui/Toggle'
import { getGamesForSection, SECTIONS } from '../games/config'
import type { Stats } from '../hooks/useStats'
import type { GameConfig, Section } from '../types/game'

// Each node gets an X offset (percent of container width) for the zigzag
// Pattern: center, right, center, left, center, right...
const ZIGZAG = [50, 72, 50, 28, 50, 72, 50, 28, 50] as const

function getNodeX(index: number): number {
  return ZIGZAG[index % ZIGZAG.length] ?? 50
}

// Build one smooth SVG path through all node centers
// nodeYs are the vertical centers of each node in px
function buildSmoothPath(count: number, nodeSpacing: number): string {
  if (count < 2) {
    return ''
  }

  const points = Array.from({ length: count }, (_, i) => ({
    x: getNodeX(i),
    y: i * nodeSpacing,
  }))

  // Start at first point
  let d = `M ${points[0]?.x} ${points[0]?.y}`

  // Draw smooth cubic bezier between each pair
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i]
    const next = points[i + 1]
    if (!curr || !next) {
      continue
    }
    const midY = (curr.y + next.y) / 2
    d += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`
  }

  return d
}

const NODE_SPACING = 160 // px between node centers

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
          const totalHeight = (games.length - 1) * NODE_SPACING

          return (
            <div key={section.id} className={`section ${isActive ? 'section--active' : ''}`}>
              <SectionBanner
                section={section}
                earnedStars={sectionStars}
                totalPossibleStars={totalPossible}
                locked={locked}
              />
              <div
                className={`path__track ${locked ? 'path__track--locked' : ''}`}
                style={{ height: `${totalHeight + 140}px` }}
              >
                <svg
                  className="path__svg"
                  viewBox={`0 0 100 ${totalHeight + 140}`}
                  preserveAspectRatio="none"
                >
                  {/* Outer thick trail */}
                  <path
                    d={buildSmoothPath(games.length, NODE_SPACING)}
                    fill="none"
                    stroke="var(--bg-light)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    transform="translate(0, 70)"
                  />
                  {/* Inner lighter trail on top */}
                  <path
                    d={buildSmoothPath(games.length, NODE_SPACING)}
                    fill="none"
                    stroke="var(--bg-card)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    transform="translate(0, 70)"
                  />
                </svg>

                {/* Nodes positioned absolutely */}
                {games.map((game, i) => (
                  <div
                    key={game.id}
                    className="path__node-abs"
                    style={{
                      top: `${i * NODE_SPACING + 70}px`,
                      left: `${getNodeX(i)}%`,
                    }}
                  >
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

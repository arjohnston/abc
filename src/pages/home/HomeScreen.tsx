import './HomeScreen.css'

import { SettingsModal } from '@common/components/SettingsModal/SettingsModal'
import type { GameConfig, Section } from '@common/types/game'
import { CoreBox, CoreButton, CoreRow, CoreText, Spacing } from '@core'
import { getGamesForSection, MINI_GAMES, SECTIONS } from '@games/config'
import type { Stats } from '@hooks/useStats'
import { Fragment, useEffect, useRef, useState } from 'react'

import { GamePreviewModal } from './components/GamePreviewModal/GamePreviewModal'
import { MiniGameNode } from './components/MiniGameNode/MiniGameNode'
import { PathNode } from './components/PathNode/PathNode'
import { SectionBanner } from './components/SectionBanner/SectionBanner'

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
  onPlayMiniGame: (id: string) => void
  onShowBonus: () => void
  bonusUnlocked: boolean
  onReset: () => void
  stats: Stats
  getStars: (gameId: string) => number
  getTotalStars: () => number
  isSectionUnlocked: (section: Section) => boolean
}

export function HomeScreen({
  isRandom,
  onToggleRandom,
  onSelectGame,
  onPlayMiniGame,
  onShowBonus,
  bonusUnlocked,
  onReset,
  stats,
  getStars,
  getTotalStars,
  isSectionUnlocked,
}: HomeScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [previewGame, setPreviewGame] = useState<GameConfig | null>(null)

  useEffect(() => {
    // Jump to top instantly, then smoothly scroll down to the active section.
    window.scrollTo(0, 0)

    const timer = setTimeout(() => {
      const all = scrollRef.current?.querySelectorAll<HTMLElement>('.section--active')
      const section = all && all.length > 0 ? all[all.length - 1] : null
      if (!section) {
        return
      }
      // scrollY is 0 at this point, so getBoundingClientRect().top === page offset
      const top = section.getBoundingClientRect().top - 80
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  const totalStars = getTotalStars()

  return (
    <div className="home" ref={scrollRef}>
      {previewGame && (
        <GamePreviewModal
          game={previewGame}
          stars={getStars(previewGame.id)}
          onPlay={() => {
            onSelectGame(previewGame)
            setPreviewGame(null)
          }}
          onClose={() => setPreviewGame(null)}
        />
      )}

      {showSettings && (
        <SettingsModal
          isRandom={isRandom}
          onToggleRandom={onToggleRandom}
          onReset={onReset}
          onClose={() => setShowSettings(false)}
        />
      )}

      <header className="home-header">
        <CoreBox className="home-title" marginBottom={8}>
          <CoreText size="h1">
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
          </CoreText>
        </CoreBox>
        <CoreText size="h3" color="muted">
          Pick a game and start learning!
        </CoreText>
        <div className="home-icon-btns">
          <CoreButton
            className={`home-icon-btn ${!bonusUnlocked ? 'home-icon-btn--locked' : ''}`}
            onClick={bonusUnlocked ? onShowBonus : undefined}
            data-tooltip={bonusUnlocked ? 'Play Games' : 'Complete Challenge to unlock!'}
            aria-label={bonusUnlocked ? 'Play Games' : 'Locked'}
          >
            {bonusUnlocked ? '🎮' : '🔒'}
          </CoreButton>
          <CoreButton
            className="home-icon-btn"
            onClick={() => setShowSettings(true)}
            data-tooltip="Settings"
            aria-label="Settings"
          >
            ⚙️
          </CoreButton>
        </div>
      </header>

      {(stats.totalPlays > 0 || totalStars > 0) && (
        <CoreRow justify="center" gap={Spacing.lg}>
          <CoreBox className="stat">
            <CoreText size="sm" color="muted">
              🎮 {stats.totalPlays} played
            </CoreText>
          </CoreBox>
          <CoreBox className="stat">
            <CoreText size="sm" color="muted">
              ⭐ {totalStars} stars
            </CoreText>
          </CoreBox>
        </CoreRow>
      )}

      <div className="path">
        {SECTIONS.map((section, sectionIndex) => {
          const games = getGamesForSection(section.id)
          const locked = !isSectionUnlocked(section)
          const sectionStars = games.reduce((sum, g) => sum + getStars(g.id), 0)
          const totalPossible = games.length * 3
          const hasIncomplete = games.some((g) => getStars(g.id) < 3)
          const isActive = !locked && hasIncomplete
          const totalHeight = (games.length - 1) * NODE_SPACING
          const miniGamesHere = MINI_GAMES.filter((mg) => mg.afterSectionIndex === sectionIndex)
          // Bonus unlocked when every game in this section has ≥1 star
          const bonusUnlocked = !locked && games.every((g) => getStars(g.id) >= 1)
          const lockHint = `Get 1 star in every ${section.title} game!`

          return (
            <Fragment key={section.id}>
              <div className={`section ${isActive ? 'section--active' : ''}`}>
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
                        onClick={() => setPreviewGame(game)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {miniGamesHere.map((mg) => (
                <MiniGameNode
                  key={mg.id}
                  emoji={mg.emoji}
                  title={mg.title}
                  locked={!bonusUnlocked}
                  lockHint={lockHint}
                  onClick={() => onPlayMiniGame(mg.id)}
                />
              ))}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

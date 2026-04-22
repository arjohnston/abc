import './MiniGameScreen.css'

import { ArcadeComplete } from '@common/components/ArcadeComplete/ArcadeComplete'
import { GameShell } from '@common/components/GameShell/GameShell'
import { CoreText } from '@core'
import { useSoundEffects } from '@hooks/useSoundEffects'
import { useSpeech } from '@hooks/useSpeech'
import { useCallback, useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const GRID_SIZE = 5
const TILE_COUNT = 6 // how many tiles are visible at once
const WIN_SCORE = 7
const COLORS = ['green', 'blue', 'purple', 'orange', 'red', 'yellow'] as const
type TileColor = (typeof COLORS)[number]

interface Tile {
  char: string
  color: TileColor
}

type Grid = (Tile | null)[][]

interface Pos {
  row: number
  col: number
}

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)] ?? 'A'
}

function randomColor(): TileColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)] ?? 'green'
}

function randomTile(): Tile {
  return { char: randomChar(), color: randomColor() }
}

/** All empty cell positions, excluding a given position */
function emptyCells(grid: Grid, exclude: Pos): Pos[] {
  const cells: Pos[] = []
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r]?.[c] && !(r === exclude.row && c === exclude.col)) {
        cells.push({ row: r, col: c })
      }
    }
  }
  return cells
}

/** All tile positions (non-null cells), excluding a given position */
function tileCells(grid: Grid, exclude: Pos): Pos[] {
  const cells: Pos[] = []
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r]?.[c] && !(r === exclude.row && c === exclude.col)) {
        cells.push({ row: r, col: c })
      }
    }
  }
  return cells
}

function makeGrid(playerPos: Pos): Grid {
  const grid: Grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null),
  )
  // Place TILE_COUNT tiles at random non-player positions
  const all: Pos[] = []
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (r !== playerPos.row || c !== playerPos.col) {
        all.push({ row: r, col: c })
      }
    }
  }
  // Shuffle and take first TILE_COUNT
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = all[i] as Pos
    all[i] = all[j] as Pos
    all[j] = tmp
  }
  for (let i = 0; i < TILE_COUNT; i++) {
    const pos = all[i]
    if (!pos) {
      continue
    }
    const row = grid[pos.row]
    if (row) {
      row[pos.col] = randomTile()
    }
  }
  return grid
}

/** Pick the char of a random visible tile (not at player pos) */
function pickTarget(grid: Grid, playerPos: Pos): string {
  const candidates = tileCells(grid, playerPos)
  const pick = candidates[Math.floor(Math.random() * candidates.length)]
  if (!pick) {
    return ''
  }
  return grid[pick.row]?.[pick.col]?.char ?? ''
}

interface MiniGameScreenProps {
  onBack: () => void
}

const START_POS: Pos = { row: 2, col: 2 }

export function MiniGameScreen({ onBack }: MiniGameScreenProps) {
  const [grid, setGrid] = useState<Grid>(() => makeGrid(START_POS))
  const [player, setPlayer] = useState<Pos>(START_POS)
  const [target, setTarget] = useState<string>('')
  const [score, setScore] = useState(0)
  const [wrongCell, setWrongCell] = useState<Pos | null>(null)
  const [shakeKey, setShakeKey] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const wrongTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  const speak = useSpeech()
  const { playChomp, playOops, playComplete } = useSoundEffects()

  // Set initial target once on mount — grid is the initial value from useState
  useEffect(() => {
    const t = pickTarget(grid, START_POS)
    const id = setTimeout(() => {
      setTarget(t)
      speak(t)
    }, 0)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMove = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      if (isComplete) {
        return
      }
      setPlayer((prev) => {
        const next = { ...prev }
        if (dir === 'up') {
          next.row = Math.max(0, prev.row - 1)
        }
        if (dir === 'down') {
          next.row = Math.min(GRID_SIZE - 1, prev.row + 1)
        }
        if (dir === 'left') {
          next.col = Math.max(0, prev.col - 1)
        }
        if (dir === 'right') {
          next.col = Math.min(GRID_SIZE - 1, prev.col + 1)
        }

        if (next.row === prev.row && next.col === prev.col) {
          return prev
        }

        const tile = grid[next.row]?.[next.col]

        if (!tile) {
          // Empty cell — just move, no reaction
          return next
        }

        if (tile.char === target) {
          // Correct — eat it, spawn a replacement elsewhere
          playChomp()
          setGrid((g) => {
            const fresh = g.map((row) => [...row]) as Grid
            const freshRow = fresh[next.row]
            if (freshRow) {
              freshRow[next.col] = null
            } // eat the tile

            const newScore = score + 1
            setScore(newScore)

            if (newScore >= WIN_SCORE) {
              setIsComplete(true)
              playComplete()
              return fresh
            }

            // Spawn a new tile on a random empty cell
            const empties = emptyCells(fresh, next)
            if (empties.length > 0) {
              const spawn = empties[Math.floor(Math.random() * empties.length)]
              if (spawn) {
                const spawnRow = fresh[spawn.row]
                if (spawnRow) {
                  spawnRow[spawn.col] = randomTile()
                }
              }
            }

            const newTarget = pickTarget(fresh, next)
            setTarget(newTarget)
            speak(newTarget)
            return fresh
          })
        } else {
          // Wrong tile — oops + shake
          playOops()
          setWrongCell(next)
          setShakeKey((k) => k + 1)
          if (wrongTimeout.current) {
            clearTimeout(wrongTimeout.current)
          }
          wrongTimeout.current = setTimeout(() => setWrongCell(null), 500)
        }

        return next
      })
    },
    [grid, target, score, isComplete, playChomp, playOops, playComplete, speak],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) {
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleMove('up')
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleMove('down')
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleMove('left')
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleMove('right')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove])

  useEffect(() => {
    return () => {
      if (wrongTimeout.current) {
        clearTimeout(wrongTimeout.current)
      }
    }
  }, [])

  const restart = useCallback(() => {
    const g = makeGrid(START_POS)
    const t = pickTarget(g, START_POS)
    setGrid(g)
    setPlayer(START_POS)
    setTarget(t)
    setScore(0)
    setWrongCell(null)
    setIsComplete(false)
    speak(t)
  }, [speak])

  if (isComplete) {
    return (
      <ArcadeComplete
        emoji="🐛"
        title="Yummy!"
        subtitle={`You ate ${WIN_SCORE} letters!`}
        onRestart={restart}
        onHome={onBack}
        emojiClassName="worm-bounce"
      />
    )
  }

  return (
    <GameShell
      onBack={onBack}
      percent={(score / WIN_SCORE) * 100}
      score={score}
      className="mini-game"
    >
      <div className="mini-game-area">
        <div className="mini-game-target">
          <CoreText size="h3" color="muted">
            Find the
          </CoreText>
          <span className="mini-game-target-char">{target}</span>
        </div>

        <div className="mini-game-progress">
          {Array.from({ length: WIN_SCORE }, (_, i) => (
            <div key={i} className={`mini-dot ${i < score ? 'mini-dot--filled' : ''}`} />
          ))}
        </div>

        <div className="mini-grid">
          {grid.map((row, r) =>
            row.map((tile, c) => {
              const isPlayer = player.row === r && player.col === c
              const isWrong = wrongCell?.row === r && wrongCell?.col === c

              if (isPlayer) {
                return (
                  <div key={`${r}-${c}`} className="mini-cell mini-cell--player">
                    🐛
                  </div>
                )
              }

              if (!tile) {
                return <div key={`${r}-${c}`} className="mini-cell mini-cell--empty" />
              }

              return (
                <div
                  key={isWrong ? `${r}-${c}-shake-${shakeKey}` : `${r}-${c}`}
                  className={`mini-cell mini-tile ${isWrong ? 'mini-tile--shake' : ''}`}
                  style={
                    {
                      '--tile-color': `var(--${tile.color})`,
                      '--tile-dark': `var(--${tile.color}-dark)`,
                    } as React.CSSProperties
                  }
                >
                  {tile.char}
                </div>
              )
            }),
          )}
        </div>

        <CoreText size="sm" color="muted" align="center">
          Use arrow keys ← → ↑ ↓
        </CoreText>
      </div>
    </GameShell>
  )
}

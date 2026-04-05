import './MiniGameScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Confetti } from '../components/Confetti'
import { BackButton } from '../components/ui/BackButton'
import { Button } from '../components/ui/Button'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const GRID_SIZE = 5
const TILE_COUNT = 6 // how many tiles are visible at once
const WIN_SCORE = 5
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
  return CHARS[Math.floor(Math.random() * CHARS.length)]!
}

function randomColor(): TileColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)]!
}

function randomTile(): Tile {
  return { char: randomChar(), color: randomColor() }
}

/** All empty cell positions, excluding a given position */
function emptyCells(grid: Grid, exclude: Pos): Pos[] {
  const cells: Pos[] = []
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r]![c] && !(r === exclude.row && c === exclude.col)) {
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
      if (grid[r]![c] && !(r === exclude.row && c === exclude.col)) {
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
      if (r !== playerPos.row || c !== playerPos.col) all.push({ row: r, col: c })
    }
  }
  // Shuffle and take first TILE_COUNT
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j]!, all[i]!]
  }
  for (let i = 0; i < TILE_COUNT; i++) {
    const pos = all[i]!
    grid[pos.row]![pos.col] = randomTile()
  }
  return grid
}

/** Pick the char of a random visible tile (not at player pos) */
function pickTarget(grid: Grid, playerPos: Pos): string {
  const candidates = tileCells(grid, playerPos)
  const pick = candidates[Math.floor(Math.random() * candidates.length)]!
  return grid[pick.row]![pick.col]!.char
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

  // Set initial target after grid is stable
  useEffect(() => {
    setGrid((g) => {
      const t = pickTarget(g, START_POS)
      setTarget(t)
      speak(t)
      return g
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMove = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      if (isComplete) return
      setPlayer((prev) => {
        const next = { ...prev }
        if (dir === 'up') next.row = Math.max(0, prev.row - 1)
        if (dir === 'down') next.row = Math.min(GRID_SIZE - 1, prev.row + 1)
        if (dir === 'left') next.col = Math.max(0, prev.col - 1)
        if (dir === 'right') next.col = Math.min(GRID_SIZE - 1, prev.col + 1)

        if (next.row === prev.row && next.col === prev.col) return prev

        const tile = grid[next.row]![next.col]

        if (!tile) {
          // Empty cell — just move, no reaction
          return next
        }

        if (tile.char === target) {
          // Correct — eat it, spawn a replacement elsewhere
          playChomp()
          setGrid((g) => {
            const fresh = g.map((row) => [...row]) as Grid
            fresh[next.row]![next.col] = null // eat the tile

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
              const spawn = empties[Math.floor(Math.random() * empties.length)]!
              fresh[spawn.row]![spawn.col] = randomTile()
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
          if (wrongTimeout.current) clearTimeout(wrongTimeout.current)
          wrongTimeout.current = setTimeout(() => setWrongCell(null), 500)
        }

        return next
      })
    },
    [grid, target, score, isComplete, playChomp, playOops, playComplete, speak],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key === 'ArrowUp') { e.preventDefault(); handleMove('up') }
      if (e.key === 'ArrowDown') { e.preventDefault(); handleMove('down') }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handleMove('left') }
      if (e.key === 'ArrowRight') { e.preventDefault(); handleMove('right') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove])

  useEffect(() => {
    return () => {
      if (wrongTimeout.current) clearTimeout(wrongTimeout.current)
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
      <>
        <Confetti />
        <div className="mini-game">
          <div className="mini-game-complete">
            <div className="mini-complete-emoji">🐛</div>
            <h2 className="mini-complete-title">Yummy!</h2>
            <p className="mini-complete-subtitle">You ate {WIN_SCORE} letters!</p>
            <div className="mini-complete-actions">
              <Button variant="primary" onClick={restart}>
                Play Again
              </Button>
              <Button variant="secondary" onClick={onBack}>
                Home
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="mini-game">
      <div className="mini-game-topbar">
        <BackButton onClick={onBack} />
        <span className="mini-game-title">Letter Muncher</span>
      </div>

      <div className="mini-game-area">
        <div className="mini-game-target">
          <span className="mini-game-target-label">Find the</span>
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

        <p className="mini-game-hint">Use arrow keys ← → ↑ ↓</p>
      </div>
    </div>
  )
}

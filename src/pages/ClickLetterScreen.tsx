import './ClickLetterScreen.css'

import { useCallback, useEffect, useState } from 'react'

import { CoreScreen } from '@core'
import { GameComplete } from '../components/GameComplete'
import { GameTopbar } from '../components/ui/GameTopbar'
import { useRound } from '../hooks/useRound'
import { useSpeech } from '../hooks/useSpeech'
import type { ClickLetterGameConfig, CustomGameScreenProps } from '../types/game'

const TOTAL = 10
const GRID_COUNT = 16
const COLORS = ['green', 'blue', 'purple', 'orange', 'red', 'yellow'] as const
type TileColor = (typeof COLORS)[number]

interface Tile { char: string; color: TileColor }

function buildGrid(items: string[]): { tiles: Tile[]; target: string } {
  const pool = [...items].sort(() => Math.random() - 0.5).slice(0, GRID_COUNT)
  while (pool.length < GRID_COUNT) pool.push(items[Math.floor(Math.random() * items.length)]!)
  const tiles = pool.map((char) => ({ char, color: COLORS[Math.floor(Math.random() * COLORS.length)]! }))
  return { tiles, target: tiles[Math.floor(Math.random() * tiles.length)]!.char }
}

export function ClickLetterScreen({ game, onBack, onComplete }: CustomGameScreenProps) {
  const { items } = game as ClickLetterGameConfig
  const [{ tiles, target }, setGrid] = useState(() => buildGrid(items))
  const [wrongIndex, setWrongIndex] = useState<number | null>(null)
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)

  const { score, round, lockedRef, completionResult, advance, restart } = useRound(TOTAL, onComplete)
  const speak = useSpeech()

  useEffect(() => { speak(target) }, [target, speak])

  const handleClick = useCallback(
    (tile: Tile, index: number) => {
      if (lockedRef.current) return
      lockedRef.current = true

      if (tile.char === target) {
        setCorrectIndex(index)
        advance(true)
        setTimeout(() => { setCorrectIndex(null); setGrid(buildGrid(items)) }, 520)
      } else {
        setWrongIndex(index)
        advance(false)
        setTimeout(() => { setWrongIndex(null) }, 420)
      }
    },
    [target, items, lockedRef, advance],
  )

  const handleRestart = useCallback(() => {
    restart()
    setGrid(buildGrid(items))
    setWrongIndex(null)
    setCorrectIndex(null)
  }, [restart, items])

  if (completionResult) {
    return <GameComplete score={score} total={TOTAL} stars={completionResult.stars} isNewBest={completionResult.isNewBest} onRestart={handleRestart} onHome={onBack} />
  }

  return (
    <CoreScreen className="cls">
      <GameTopbar onBack={onBack} percent={(round / TOTAL) * 100} score={score} />

      <div className="cls-prompt">
        Click: <span className="cls-target">{target}</span>
        <button className="cls-replay" onClick={() => speak(target)} title="Hear again">🔊</button>
      </div>

      <div className="cls-grid">
        {tiles.map((tile, i) => (
          <button
            key={i}
            className={`cls-tile cls-tile--${tile.color} ${correctIndex === i ? 'cls-tile--correct' : wrongIndex === i ? 'cls-tile--wrong' : ''}`}
            onClick={() => handleClick(tile, i)}
          >
            {tile.char}
          </button>
        ))}
      </div>
    </CoreScreen>
  )
}

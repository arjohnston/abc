import './ClickLetterScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { GameComplete } from '../components/GameComplete'
import { BackButton } from '../components/ui/BackButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'
import type { ClickLetterGameConfig } from '../types/game'

const TOTAL = 10
const GRID_COUNT = 16

const COLORS = ['green', 'blue', 'purple', 'orange', 'red', 'yellow'] as const
type TileColor = (typeof COLORS)[number]

interface Tile {
  char: string
  color: TileColor
}

function randomColor(): TileColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)]!
}

function buildGrid(items: string[]): { tiles: Tile[]; target: string } {
  const shuffled = [...items].sort(() => Math.random() - 0.5)
  const pool = shuffled.slice(0, GRID_COUNT)
  // ensure pool has GRID_COUNT items (pad if pool < GRID_COUNT)
  while (pool.length < GRID_COUNT) {
    pool.push(items[Math.floor(Math.random() * items.length)]!)
  }
  const tiles = pool.map((char) => ({ char, color: randomColor() }))
  const target = tiles[Math.floor(Math.random() * tiles.length)]!.char
  return { tiles, target }
}

interface Props {
  game: ClickLetterGameConfig
  onBack: () => void
  onComplete: (score: number, total: number, maxStars: number) => { stars: number; isNewBest: boolean }
}

export function ClickLetterScreen({ game, onBack, onComplete }: Props) {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [{ tiles, target }, setGrid] = useState(() => buildGrid(game.items))
  const [wrongIndex, setWrongIndex] = useState<number | null>(null)
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)
  const [completionResult, setCompletionResult] = useState<{ stars: number; isNewBest: boolean } | null>(null)

  const lockedRef = useRef(false)
  const speak = useSpeech()
  const { playCorrect, playWrong, playComplete } = useSoundEffects()

  // Announce target whenever it changes
  useEffect(() => {
    speak(target)
  }, [target, speak])

  const handleClick = useCallback(
    (tile: Tile, index: number) => {
      if (lockedRef.current) return
      lockedRef.current = true

      if (tile.char === target) {
        setCorrectIndex(index)
        playCorrect()

        const newScore = score + 1
        const newRound = round + 1

        setTimeout(() => {
          setCorrectIndex(null)
          if (newRound >= TOTAL) {
            playComplete()
            const result = onComplete(newScore, TOTAL, 3)
            setCompletionResult(result)
          } else {
            setScore(newScore)
            setRound(newRound)
            setGrid(buildGrid(game.items))
            lockedRef.current = false
          }
        }, 500)
      } else {
        setWrongIndex(index)
        playWrong()

        setTimeout(() => {
          setWrongIndex(null)
          lockedRef.current = false
        }, 400)
      }
    },
    [target, score, round, playCorrect, playWrong, playComplete, onComplete, game.items],
  )

  const handleRestart = useCallback(() => {
    setScore(0)
    setRound(0)
    setGrid(buildGrid(game.items))
    setWrongIndex(null)
    setCorrectIndex(null)
    setCompletionResult(null)
    lockedRef.current = false
  }, [game.items])

  if (completionResult) {
    return (
      <GameComplete
        score={score}
        total={TOTAL}
        stars={completionResult.stars}
        isNewBest={completionResult.isNewBest}
        onRestart={handleRestart}
        onHome={onBack}
      />
    )
  }

  return (
    <div className="cls">
      <div className="cls-topbar">
        <BackButton onClick={onBack} />
        <span className="cls-title">{game.emoji} {game.title}</span>
        <span className="cls-score">{score}/{TOTAL}</span>
      </div>
      <ProgressBar percent={(round / TOTAL) * 100} />

      <div className="cls-prompt">
        Click: <span className="cls-target">{target}</span>
        <button className="cls-replay" onClick={() => speak(target)} title="Hear again">🔊</button>
      </div>

      <div className="cls-grid">
        {tiles.map((tile, i) => (
          <button
            key={i}
            className={`cls-tile cls-tile--${tile.color} ${
              correctIndex === i ? 'cls-tile--correct' :
              wrongIndex === i   ? 'cls-tile--wrong'   : ''
            }`}
            onClick={() => handleClick(tile, i)}
          >
            {tile.char}
          </button>
        ))}
      </div>
    </div>
  )
}

import './FollowArrowScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { GameComplete } from '../components/GameComplete'
import { BackButton } from '../components/ui/BackButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ScoreBadge } from '../components/ui/ScoreBadge'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'
import type { ArrowGameConfig } from '../types/game'

const TOTAL = 12

const DIRECTIONS = ['left', 'right', 'up', 'down'] as const
type Dir = (typeof DIRECTIONS)[number]

const ARROW: Record<Dir, string> = {
  left: '←', right: '→', up: '↑', down: '↓',
}
const KEY: Record<Dir, string> = {
  left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown',
}
const COLOR: Record<Dir, string> = {
  left:  'var(--blue)',
  right: 'var(--green)',
  up:    'var(--orange)',
  down:  'var(--purple)',
}
const SPEECH: Record<Dir, string> = {
  left:  'Press the left arrow!',
  right: 'Press the right arrow!',
  up:    'Press the up arrow!',
  down:  'Press the down arrow!',
}

function buildSequence(): Dir[] {
  const seq: Dir[] = []
  for (let i = 0; i < TOTAL; i++) {
    // avoid two of the same in a row
    let dir: Dir
    do {
      dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]!
    } while (seq.length > 0 && seq[seq.length - 1] === dir)
    seq.push(dir)
  }
  return seq
}

interface Props {
  game: ArrowGameConfig
  onBack: () => void
  onComplete: (score: number, total: number, maxStars: number) => { stars: number; isNewBest: boolean }
}

export function FollowArrowScreen({ onBack, onComplete }: Props) {
  const [sequence] = useState(buildSequence)
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [completionResult, setCompletionResult] = useState<{ stars: number; isNewBest: boolean } | null>(null)

  const lockedRef = useRef(false)
  const speak = useSpeech()
  const { playCorrect, playWrong, playComplete } = useSoundEffects()

  const currentDir = sequence[roundIndex]!

  useEffect(() => {
    speak(SPEECH[currentDir])
  }, [currentDir, speak])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (lockedRef.current) return
      const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
      if (!arrowKeys.includes(e.key)) return

      e.preventDefault()
      lockedRef.current = true

      const correct = e.key === KEY[currentDir]

      if (correct) {
        setFeedback('correct')
        playCorrect()
      } else {
        setFeedback('wrong')
        playWrong()
      }

      const newScore = correct ? score + 1 : score
      const newRound = roundIndex + 1

      setTimeout(() => {
        setFeedback(null)
        if (newRound >= TOTAL) {
          playComplete()
          const result = onComplete(newScore, TOTAL, 3)
          setCompletionResult(result)
        } else {
          setScore(newScore)
          setRoundIndex(newRound)
          lockedRef.current = false
        }
      }, 500)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentDir, score, roundIndex, playCorrect, playWrong, playComplete, onComplete])

  const handleRestart = useCallback(() => {
    setRoundIndex(0)
    setScore(0)
    setFeedback(null)
    setCompletionResult(null)
    lockedRef.current = false
  }, [])

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
    <div className="fa">
      <div className="fa-topbar">
        <BackButton onClick={onBack} />
        <ProgressBar percent={(roundIndex / TOTAL) * 100} />
        <ScoreBadge score={score} />
      </div>

      <div className="fa-arena">
        <div
          className={`fa-arrow-wrap fa-arrow-wrap--${feedback ?? 'idle'}`}
          style={{ '--arrow-color': COLOR[currentDir] } as React.CSSProperties}
        >
          <span className="fa-arrow">{ARROW[currentDir]}</span>
        </div>

        <p className="fa-label">
          Press the <strong>{currentDir}</strong> arrow key
        </p>

        <div className="fa-key-hints">
          {(DIRECTIONS).map((d) => (
            <div
              key={d}
              className={`fa-key ${d === currentDir ? 'fa-key--active' : ''}`}
              style={d === currentDir ? { background: COLOR[d], borderColor: COLOR[d] } : {}}
            >
              {ARROW[d]}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

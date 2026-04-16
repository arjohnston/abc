import './MouseDirectionScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { GameComplete } from '../components/GameComplete'
import { BackButton } from '../components/ui/BackButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'
import type { MouseDirectionGameConfig } from '../types/game'

const TOTAL = 10
const DIRECTIONS = ['left', 'right', 'up', 'down'] as const
type Dir = (typeof DIRECTIONS)[number]

const LABELS: Record<Dir, string> = {
  left: '← Left',
  right: 'Right →',
  up: '↑ Up',
  down: '↓ Down',
}

const SPEECH_TEXT: Record<Dir, string> = {
  left: 'Move your mouse to the left box',
  right: 'Move your mouse to the right box',
  up: 'Move your mouse to the top box',
  down: 'Move your mouse to the bottom box',
}

function randomDir(): Dir {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]!
}

function pickNextDir(prev: Dir): Dir {
  const choices = DIRECTIONS.filter((d) => d !== prev)
  return choices[Math.floor(Math.random() * choices.length)]!
}

interface Props {
  game: MouseDirectionGameConfig
  onBack: () => void
  onComplete: (score: number, total: number, maxStars: number) => { stars: number; isNewBest: boolean }
}

export function MouseDirectionScreen({ game, onBack, onComplete }: Props) {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [currentDir, setCurrentDir] = useState<Dir>(() => randomDir())
  const [feedback, setFeedback] = useState<'hit' | null>(null)
  const [completionResult, setCompletionResult] = useState<{ stars: number; isNewBest: boolean } | null>(null)
  const lockedRef = useRef(false)
  const speak = useSpeech()
  const { playCorrect, playComplete } = useSoundEffects()

  // Announce direction on mount and on change
  useEffect(() => {
    speak(SPEECH_TEXT[currentDir])
  }, [currentDir, speak])

  const handleHit = useCallback(
    (dir: Dir) => {
      if (lockedRef.current || dir !== currentDir) return
      lockedRef.current = true

      setFeedback('hit')
      playCorrect()

      const newScore = score + 1
      const newRound = round + 1

      setTimeout(() => {
        setFeedback(null)
        if (newRound >= TOTAL) {
          playComplete()
          const result = onComplete(newScore, TOTAL, 3)
          setCompletionResult(result)
        } else {
          setScore(newScore)
          setRound(newRound)
          setCurrentDir((prev) => pickNextDir(prev))
          lockedRef.current = false
        }
      }, 600)
    },
    [currentDir, score, round, playCorrect, playComplete, onComplete],
  )

  const handleRestart = useCallback(() => {
    setScore(0)
    setRound(0)
    setCurrentDir(randomDir())
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
    <div className="mds">
      <div className="mds-topbar">
        <BackButton onClick={onBack} />
        <span className="mds-title">{game.emoji} {game.title}</span>
        <span className="mds-score">{score}/{TOTAL}</span>
      </div>
      <ProgressBar percent={(round / TOTAL) * 100} />

      <div className="mds-instruction">
        Move your mouse to the <strong>{LABELS[currentDir]}</strong> box!
      </div>

      <div className="mds-arena">
        {(DIRECTIONS).map((dir) => (
          <div
            key={dir}
            className={`mds-zone mds-zone--${dir} ${dir === currentDir ? `mds-zone--active ${feedback === 'hit' ? 'mds-zone--hit' : ''}` : 'mds-zone--dim'}`}
            style={{ '--zone-color': game.color } as React.CSSProperties}
            onMouseEnter={() => handleHit(dir)}
          >
            <span className="mds-zone-label">{LABELS[dir]}</span>
          </div>
        ))}

        <div className="mds-center">
          <span className="mds-cursor-emoji">🖱️</span>
        </div>
      </div>
    </div>
  )
}

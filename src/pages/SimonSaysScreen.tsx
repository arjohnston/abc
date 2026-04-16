import './SimonSaysScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { GameComplete } from '../components/GameComplete'
import { BackButton } from '../components/ui/BackButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ScoreBadge } from '../components/ui/ScoreBadge'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'
import type { SimonSaysGameConfig } from '../types/game'

const TOTAL = 12          // total rounds
const DONT_HOLD_MS = 2500 // how long to hold off on a fake-out round
const FAKE_RATIO = 0.3    // 30% of rounds are fake-outs

type RoundType = 'do' | 'dont'

interface Round {
  char: string
  type: RoundType
}

function buildRounds(items: string[]): Round[] {
  const rounds: Round[] = []
  const pool = [...items].sort(() => Math.random() - 0.5)

  for (let i = 0; i < TOTAL; i++) {
    const char = pool[i % pool.length]!
    const type: RoundType = Math.random() < FAKE_RATIO ? 'dont' : 'do'
    rounds.push({ char, type })
  }
  return rounds
}

interface Props {
  game: SimonSaysGameConfig
  onBack: () => void
  onComplete: (score: number, total: number, maxStars: number) => { stars: number; isNewBest: boolean }
}

export function SimonSaysScreen({ game, onBack, onComplete }: Props) {
  const [rounds] = useState(() => buildRounds(game.items))
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [holdProgress, setHoldProgress] = useState(0) // 0-100 for dont rounds
  const [completionResult, setCompletionResult] = useState<{ stars: number; isNewBest: boolean } | null>(null)

  const lockedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const speak = useSpeech()
  const { playCorrect, playWrong, playComplete } = useSoundEffects()

  const currentRound = rounds[roundIndex]

  const advance = useCallback(
    (correct: boolean, currentScore: number, currentRoundIndex: number) => {
      const newScore = correct ? currentScore + 1 : currentScore
      const newRound = currentRoundIndex + 1

      setTimeout(() => {
        setFeedback(null)
        setHoldProgress(0)
        if (newRound >= TOTAL) {
          playComplete()
          const result = onComplete(newScore, TOTAL, 3)
          setCompletionResult(result)
        } else {
          setScore(newScore)
          setRoundIndex(newRound)
          lockedRef.current = false
        }
      }, 700)
    },
    [playComplete, onComplete],
  )

  // Announce each round via TTS
  useEffect(() => {
    if (!currentRound) return

    const { char, type } = currentRound
    lockedRef.current = false
    setHoldProgress(0)

    if (type === 'do') {
      speak(`Simon says press ${char}`)
    } else {
      speak(`Press ${char}`)
    }

    // For dont rounds, start the hold timer
    if (type === 'dont') {
      startTimeRef.current = Date.now()

      function tick() {
        const elapsed = Date.now() - startTimeRef.current
        const pct = Math.min((elapsed / DONT_HOLD_MS) * 100, 100)
        setHoldProgress(pct)

        if (pct < 100) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          // They held off — correct!
          if (!lockedRef.current) {
            lockedRef.current = true
            setFeedback('correct')
            playCorrect()
            advance(true, score, roundIndex)
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  // Keyboard handler
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (lockedRef.current || !currentRound) return
      const key = e.key.toUpperCase()
      if (!/^[A-Z0-9]$/.test(key)) return

      lockedRef.current = true
      cancelAnimationFrame(rafRef.current)

      if (currentRound.type === 'do') {
        // Must press the correct letter
        if (key === currentRound.char) {
          setFeedback('correct')
          playCorrect()
          advance(true, score, roundIndex)
        } else {
          setFeedback('wrong')
          playWrong()
          advance(false, score, roundIndex)
        }
      } else {
        // Any press is wrong on a fake-out
        setFeedback('wrong')
        playWrong()
        advance(false, score, roundIndex)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentRound, score, roundIndex, playCorrect, playWrong, advance])

  const handleRestart = useCallback(() => {
    setRoundIndex(0)
    setScore(0)
    setFeedback(null)
    setHoldProgress(0)
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

  if (!currentRound) return null

  const isDo = currentRound.type === 'do'

  return (
    <div className="ss">
      <div className="ss-topbar">
        <BackButton onClick={onBack} />
        <ProgressBar percent={(roundIndex / TOTAL) * 100} />
        <ScoreBadge score={score} />
      </div>

      <div className={`ss-banner ${isDo ? 'ss-banner--do' : 'ss-banner--dont'}`}>
        {isDo ? '🤖 Simon Says!' : '🚫 Freeze!'}
      </div>

      <div
        className={`ss-char-wrap ${
          feedback === 'correct' ? 'ss-char--correct' :
          feedback === 'wrong'   ? 'ss-char--wrong'   : ''
        }`}
      >
        <span className="ss-char">{currentRound.char}</span>
      </div>

      <div className="ss-hint">
        {isDo
          ? `Press  ${currentRound.char}`
          : "Don't press anything!"}
      </div>

      {!isDo && (
        <div className="ss-hold-bar-wrap">
          <div
            className="ss-hold-bar-fill"
            style={{ width: `${holdProgress}%` }}
          />
        </div>
      )}
    </div>
  )
}

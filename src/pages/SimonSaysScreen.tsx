import './SimonSaysScreen.css'

import { useEffect, useRef, useState } from 'react'

import { GameComplete } from '../components/GameComplete'
import { GameInstruction } from '../components/GameInstruction'
import { GameShell } from '../components/GameShell'
import { useKeyInput } from '../hooks/useKeyInput'
import { useRound } from '../hooks/useRound'
import { useSpeech } from '../hooks/useSpeech'
import type { CustomGameScreenProps, SimonSaysGameConfig } from '../types/game'

const TOTAL = 12
const DONT_HOLD_MS = 2500
const FAKE_RATIO = 0.3

type RoundType = 'do' | 'dont'

interface Round {
  char: string
  type: RoundType
}

function buildRounds(items: string[]): Round[] {
  const pool = [...items].sort(() => Math.random() - 0.5)
  return Array.from({ length: TOTAL }, (_, i) => ({
    char: pool[i % pool.length] ?? '',
    type: Math.random() < FAKE_RATIO ? 'dont' : 'do',
  }))
}

export function SimonSaysScreen({ game, onBack, onComplete }: CustomGameScreenProps) {
  const { items } = game as SimonSaysGameConfig
  const [rounds] = useState(() => buildRounds(items))
  const [holdProgress, setHoldProgress] = useState(0)

  const { score, round, feedback, lockedRef, completionResult, advance, restart } = useRound(
    TOTAL,
    onComplete,
  )
  const speak = useSpeech()

  const rafRef = useRef<number>(0)
  const startTimeRef = useRef(0)

  const currentRound = rounds[round] ?? rounds[TOTAL - 1] ?? { char: '', type: 'do' as RoundType }
  const isDo = currentRound.type === 'do'

  // Announce + start hold timer on each new round
  useEffect(() => {
    lockedRef.current = false
    setHoldProgress(0)
    cancelAnimationFrame(rafRef.current)

    if (isDo) {
      speak(`Simon says press ${currentRound.char}`)
    } else {
      speak(`Press ${currentRound.char}`)
      startTimeRef.current = Date.now()

      function tick() {
        const pct = Math.min(((Date.now() - startTimeRef.current) / DONT_HOLD_MS) * 100, 100)
        setHoldProgress(pct)
        if (pct < 100) {
          rafRef.current = requestAnimationFrame(tick)
        } else if (!lockedRef.current) {
          lockedRef.current = true
          advance(true) // survived the fake-out
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  useKeyInput((key) => {
    const k = key.toUpperCase()
    if (!/^[A-Z0-9]$/.test(k)) {
      return
    }
    if (lockedRef.current) {
      return
    }
    lockedRef.current = true
    cancelAnimationFrame(rafRef.current)

    if (isDo) {
      advance(k === currentRound.char)
    } else {
      advance(false)
    } // any key on a fake-out = wrong
  })

  if (completionResult) {
    return (
      <GameComplete
        score={score}
        total={TOTAL}
        stars={completionResult.stars}
        isNewBest={completionResult.isNewBest}
        onRestart={restart}
        onHome={onBack}
      />
    )
  }

  return (
    <GameShell onBack={onBack} percent={(round / TOTAL) * 100} score={score} center className="ss">
      <div className="ss-content">
        <div className={`ss-banner ${isDo ? 'ss-banner--do' : 'ss-banner--dont'}`}>
          {isDo ? '🤖 Simon Says!' : '🚫 Freeze!'}
        </div>

        <div
          className={`ss-char-wrap ${feedback === 'correct' ? 'ss-char--correct' : feedback === 'wrong' ? 'ss-char--wrong' : ''}`}
        >
          <span className="ss-char">{currentRound.char}</span>
        </div>

        <GameInstruction>
          {isDo ? `Press  ${currentRound.char}` : "Don't press anything!"}
        </GameInstruction>

        {!isDo && (
          <div className="ss-hold-bar-wrap">
            <div className="ss-hold-bar-fill" style={{ width: `${holdProgress}%` }} />
          </div>
        )}
      </div>
    </GameShell>
  )
}

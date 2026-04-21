import './ChaseBallScreen.css'

import { useCallback, useRef } from 'react'

import { GameComplete } from '../components/GameComplete'
import { GameShell } from '../components/GameShell'
import { usePhysicsObject } from '../hooks/usePhysicsObject'
import { useRound } from '../hooks/useRound'
import { useSpeech } from '../hooks/useSpeech'
import type { CustomGameScreenProps } from '../types/game'

const TOTAL = 10
const BALL_R = 56
const SPEED = 1.5

export function ChaseBallScreen({ onBack, onComplete }: CustomGameScreenProps) {
  const arenaRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: -999, y: -999 })

  const { score, round, lockedRef, completionResult, advance, restart } = useRound(TOTAL, onComplete)
  const speak = useSpeech()

  const { randomize } = usePhysicsObject(
    arenaRef,
    ballRef,
    BALL_R,
    SPEED,
    // onFrame: check proximity each tick
    (x, y) => {
      if (lockedRef.current) return
      const dx = mouseRef.current.x - x
      const dy = mouseRef.current.y - y
      if (Math.sqrt(dx * dx + dy * dy) < BALL_R + 12) {
        lockedRef.current = true
        advance(true)
        setTimeout(randomize, 520)
      }
    },
    lockedRef,
  )

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = arenaRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const handleRestart = useCallback(() => {
    restart()
    speak('Hover over the ball to catch it!')
  }, [restart, speak])

  if (completionResult) {
    return <GameComplete score={score} total={TOTAL} stars={completionResult.stars} isNewBest={completionResult.isNewBest} onRestart={handleRestart} onHome={onBack} />
  }

  return (
    <GameShell onBack={onBack} percent={(round / TOTAL) * 100} score={score} className="cbs">
      <div className="cbs-arena" ref={arenaRef} onMouseMove={handleMouseMove}>
        <div
          ref={ballRef}
          className={`cbs-ball ${lockedRef.current ? 'cbs-ball--caught' : ''}`}
          style={{ width: BALL_R * 2, height: BALL_R * 2 }}
        >
          🎾
        </div>
      </div>
    </GameShell>
  )
}

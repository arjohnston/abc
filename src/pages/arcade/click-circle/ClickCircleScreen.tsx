import './ClickCircleScreen.css'

import { ArcadeComplete } from '@common/components/ArcadeComplete/ArcadeComplete'
import { GameInstruction } from '@common/components/GameInstruction/GameInstruction'
import { GameShell } from '@common/components/GameShell/GameShell'
import { usePhysicsObject } from '@hooks/usePhysicsObject'
import { useSoundEffects } from '@hooks/useSoundEffects'
import { useSpeech } from '@hooks/useSpeech'
import { useCallback, useRef, useState } from 'react'

const TOTAL = 10
const CIRCLE_R = 48
const SPEED = 1.4

interface Props {
  onBack: () => void
}

export function ClickCircleScreen({ onBack }: Props) {
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [flash, setFlash] = useState(false)

  const arenaRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const hitLockedRef = useRef(false)
  const scoreRef = useRef(0)

  const speak = useSpeech()
  const { playCorrect, playComplete } = useSoundEffects()

  const { randomize } = usePhysicsObject(arenaRef, circleRef, CIRCLE_R, SPEED)

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      if (hitLockedRef.current) {
        return
      }
      hitLockedRef.current = true

      scoreRef.current += 1
      const newScore = scoreRef.current
      setScore(newScore)
      setFlash(true)
      playCorrect()

      setTimeout(() => {
        setFlash(false)
        if (newScore >= TOTAL) {
          playComplete()
          setDone(true)
        } else {
          randomize()
          hitLockedRef.current = false
        }
      }, 300)
    },
    [playCorrect, playComplete, randomize],
  )

  const handleRestart = useCallback(() => {
    scoreRef.current = 0
    hitLockedRef.current = false
    setScore(0)
    setDone(false)
    setFlash(false)
    randomize()
    speak('Click the circle!')
  }, [randomize, speak])

  if (done) {
    return (
      <ArcadeComplete
        emoji="🎉"
        title="You got them all!"
        subtitle={`Clicked ${TOTAL} circles!`}
        onRestart={handleRestart}
        onHome={onBack}
      />
    )
  }

  return (
    <GameShell onBack={onBack} percent={(score / TOTAL) * 100} score={score} className="cc">
      <GameInstruction>Click the moving circle!</GameInstruction>

      <div className="cc-arena" ref={arenaRef}>
        <div
          ref={circleRef}
          role="button"
          tabIndex={0}
          aria-label="Hit the circle"
          className={`cc-circle ${flash ? 'cc-circle--hit' : ''}`}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick()
            }
          }}
          style={{ width: CIRCLE_R * 2, height: CIRCLE_R * 2 }}
        />
      </div>
    </GameShell>
  )
}

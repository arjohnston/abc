import './ClickCircleScreen.css'

import { useCallback, useRef, useState } from 'react'

import { CoreScreen, CoreText } from '@core'
import { Confetti } from '../components/Confetti'
import { Button } from '../components/ui/Button'
import { GameTopbar } from '../components/ui/GameTopbar'
import { usePhysicsObject } from '../hooks/usePhysicsObject'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'

const TOTAL = 10
const CIRCLE_R = 48
const SPEED = 1.4

interface Props { onBack: () => void }

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
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (hitLockedRef.current) return
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
      <CoreScreen center className="cc">
        <Confetti />
        <GameTopbar onBack={onBack} percent={100} score={TOTAL} />
        <div className="cc-complete">
          <div className="cc-complete-emoji">🎉</div>
          <h2 className="cc-complete-title">You got them all!</h2>
          <p className="cc-complete-score">Clicked {TOTAL} circles!</p>
          <div className="cc-complete-actions">
            <Button variant="primary" onClick={handleRestart}>Play Again</Button>
            <Button variant="secondary" onClick={onBack}>Home</Button>
          </div>
        </div>
      </CoreScreen>
    )
  }

  return (
    <CoreScreen className="cc">
      <GameTopbar onBack={onBack} percent={(score / TOTAL) * 100} score={score} />

      <CoreText size="p" className="game-instruction">Click the moving circle!</CoreText>

      <div className="game-arena cc-arena" ref={arenaRef}>
        <div
          ref={circleRef}
          className={`cc-circle ${flash ? 'cc-circle--hit' : ''}`}
          onClick={handleClick}
          style={{ width: CIRCLE_R * 2, height: CIRCLE_R * 2 }}
        />
      </div>
    </CoreScreen>
  )
}

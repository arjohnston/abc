import './ClickCircleScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Confetti } from '../components/Confetti'
import { BackButton } from '../components/ui/BackButton'
import { Button } from '../components/ui/Button'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'

const TOTAL = 10
const CIRCLE_R = 48       // radius px
const SPEED = 1.4         // px per frame — slow and friendly

function randomVel(): { vx: number; vy: number } {
  const angle = Math.random() * Math.PI * 2
  return { vx: Math.cos(angle) * SPEED, vy: Math.sin(angle) * SPEED }
}

function randomPos(w: number, h: number): { x: number; y: number } {
  return {
    x: CIRCLE_R + Math.random() * (w - CIRCLE_R * 2),
    y: CIRCLE_R + Math.random() * (h - CIRCLE_R * 2),
  }
}

interface Props {
  onBack: () => void
}

export function ClickCircleScreen({ onBack }: Props) {
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [flashHit, setFlashHit] = useState(false)

  const arenaRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 200, y: 200 })
  const velRef = useRef(randomVel())
  const scoreRef = useRef(0)
  const hitLockedRef = useRef(false)
  const rafRef = useRef<number>(0)

  const speak = useSpeech()
  const { playCorrect, playComplete } = useSoundEffects()

  useEffect(() => {
    speak('Click the circle!')
  }, [speak])

  useEffect(() => {
    const arena = arenaRef.current
    if (!arena) return
    const { width, height } = arena.getBoundingClientRect()
    posRef.current = randomPos(width, height)

    function loop() {
      const arena = arenaRef.current
      const circle = circleRef.current
      if (!arena || !circle) { rafRef.current = requestAnimationFrame(loop); return }

      const { width: w, height: h } = arena.getBoundingClientRect()
      let { x, y } = posRef.current
      let { vx, vy } = velRef.current

      x += vx
      y += vy

      if (x - CIRCLE_R < 0)  { x = CIRCLE_R;     vx = Math.abs(vx) }
      if (x + CIRCLE_R > w)  { x = w - CIRCLE_R; vx = -Math.abs(vx) }
      if (y - CIRCLE_R < 0)  { y = CIRCLE_R;     vy = Math.abs(vy) }
      if (y + CIRCLE_R > h)  { y = h - CIRCLE_R; vy = -Math.abs(vy) }

      posRef.current = { x, y }
      velRef.current = { vx, vy }

      circle.style.left = `${x - CIRCLE_R}px`
      circle.style.top  = `${y - CIRCLE_R}px`

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleCircleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (hitLockedRef.current) return
    hitLockedRef.current = true

    scoreRef.current += 1
    const newScore = scoreRef.current
    setScore(newScore)
    setFlashHit(true)
    playCorrect()

    setTimeout(() => {
      setFlashHit(false)
      if (newScore >= TOTAL) {
        cancelAnimationFrame(rafRef.current)
        playComplete()
        setDone(true)
      } else {
        const arena = arenaRef.current
        if (arena) {
          const { width, height } = arena.getBoundingClientRect()
          posRef.current = randomPos(width, height)
          velRef.current = randomVel()
        }
        hitLockedRef.current = false
      }
    }, 300)
  }, [playCorrect, playComplete])

  const handleRestart = useCallback(() => {
    scoreRef.current = 0
    hitLockedRef.current = false
    setScore(0)
    setDone(false)
    setFlashHit(false)

    const arena = arenaRef.current
    if (arena) {
      const { width, height } = arena.getBoundingClientRect()
      posRef.current = randomPos(width, height)
      velRef.current = randomVel()
    }

    // Restart loop
    cancelAnimationFrame(rafRef.current)
    const arena2 = arenaRef.current
    if (!arena2) return

    function loop() {
      const arena = arenaRef.current
      const circle = circleRef.current
      if (!arena || !circle) { rafRef.current = requestAnimationFrame(loop); return }
      const { width: w, height: h } = arena.getBoundingClientRect()
      let { x, y } = posRef.current
      let { vx, vy } = velRef.current
      x += vx; y += vy
      if (x - CIRCLE_R < 0)  { x = CIRCLE_R;     vx = Math.abs(vx) }
      if (x + CIRCLE_R > w)  { x = w - CIRCLE_R; vx = -Math.abs(vx) }
      if (y - CIRCLE_R < 0)  { y = CIRCLE_R;     vy = Math.abs(vy) }
      if (y + CIRCLE_R > h)  { y = h - CIRCLE_R; vy = -Math.abs(vy) }
      posRef.current = { x, y }; velRef.current = { vx, vy }
      circle.style.left = `${x - CIRCLE_R}px`
      circle.style.top  = `${y - CIRCLE_R}px`
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  if (done) {
    return (
      <div className="cc cc--done">
        <Confetti />
        <div className="cc-topbar">
          <BackButton onClick={onBack} />
          <span className="cc-title">🎯 Click the Circle</span>
        </div>
        <div className="cc-complete">
          <div className="cc-complete-emoji">🎉</div>
          <h2 className="cc-complete-title">You got them all!</h2>
          <p className="cc-complete-score">Clicked {TOTAL} circles!</p>
          <div className="cc-complete-actions">
            <Button variant="primary" onClick={handleRestart}>Play Again</Button>
            <Button variant="secondary" onClick={onBack}>Home</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cc">
      <div className="cc-topbar">
        <BackButton onClick={onBack} />
        <span className="cc-title">🎯 Click the Circle</span>
        <span className="cc-score">{score}/{TOTAL}</span>
      </div>

      <p className="cc-instruction">Click the moving circle!</p>

      <div className="cc-arena" ref={arenaRef}>
        <div
          ref={circleRef}
          className={`cc-circle ${flashHit ? 'cc-circle--hit' : ''}`}
          onClick={handleCircleClick}
          style={{ width: CIRCLE_R * 2, height: CIRCLE_R * 2 }}
        />
      </div>
    </div>
  )
}

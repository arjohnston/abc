import './ChaseBallScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { GameComplete } from '../components/GameComplete'
import { BackButton } from '../components/ui/BackButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'
import type { ChaseBallGameConfig } from '../types/game'

const TOTAL = 10
const BALL_SIZE = 80 // px
const SPEED_MIN = 2.5
const SPEED_MAX = 4.5

function randomVelocity(): { vx: number; vy: number } {
  const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
  const angle = Math.random() * Math.PI * 2
  return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }
}

function randomPos(w: number, h: number): { x: number; y: number } {
  return {
    x: BALL_SIZE / 2 + Math.random() * (w - BALL_SIZE),
    y: BALL_SIZE / 2 + Math.random() * (h - BALL_SIZE),
  }
}

interface Props {
  game: ChaseBallGameConfig
  onBack: () => void
  onComplete: (score: number, total: number, maxStars: number) => { stars: number; isNewBest: boolean }
}

export function ChaseBallScreen({ game, onBack, onComplete }: Props) {
  const [score, setScore] = useState(0)
  const [caught, setCaught] = useState(false)
  const [completionResult, setCompletionResult] = useState<{ stars: number; isNewBest: boolean } | null>(null)

  const arenaRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 200, y: 200 })
  const velRef = useRef(randomVelocity())
  const mouseRef = useRef({ x: -999, y: -999 })
  const scoreRef = useRef(0)
  const caughtRef = useRef(false)
  const rafRef = useRef<number>(0)

  const speak = useSpeech()
  const { playCorrect, playComplete } = useSoundEffects()

  const startBall = useCallback(() => {
    const arena = arenaRef.current
    if (!arena) return
    const { width, height } = arena.getBoundingClientRect()
    posRef.current = randomPos(width, height)
    velRef.current = randomVelocity()
    caughtRef.current = false
    setCaught(false)
  }, [])

  useEffect(() => {
    speak('Hover over the ball to catch it!')
  }, [speak])

  useEffect(() => {
    // Initialize ball position after mount
    const arena = arenaRef.current
    if (!arena) return
    const { width, height } = arena.getBoundingClientRect()
    posRef.current = randomPos(width, height)

    function loop() {
      const arena = arenaRef.current
      const ball = ballRef.current
      if (!arena || !ball) {
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      if (!caughtRef.current) {
        const { width, height } = arena.getBoundingClientRect()
        let { x, y } = posRef.current
        let { vx, vy } = velRef.current

        x += vx
        y += vy

        // Bounce off walls
        const r = BALL_SIZE / 2
        if (x - r < 0) { x = r; vx = Math.abs(vx) }
        if (x + r > width) { x = width - r; vx = -Math.abs(vx) }
        if (y - r < 0) { y = r; vy = Math.abs(vy) }
        if (y + r > height) { y = height - r; vy = -Math.abs(vy) }

        posRef.current = { x, y }
        velRef.current = { vx, vy }

        // Update DOM directly for perf
        ball.style.left = `${x - r}px`
        ball.style.top = `${y - r}px`

        // Hit detection
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const dx = mx - x
        const dy = my - y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < BALL_SIZE / 2 + 10) {
          caughtRef.current = true
          scoreRef.current += 1
          const newScore = scoreRef.current
          setScore(newScore)
          setCaught(true)
          playCorrect()

          setTimeout(() => {
            if (newScore >= TOTAL) {
              playComplete()
              const result = onComplete(newScore, TOTAL, 3)
              setCompletionResult(result)
            } else {
              const arena2 = arenaRef.current
              if (arena2) {
                const { width: w2, height: h2 } = arena2.getBoundingClientRect()
                posRef.current = randomPos(w2, h2)
              }
              velRef.current = randomVelocity()
              caughtRef.current = false
              setCaught(false)
            }
          }, 500)
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playCorrect, playComplete, onComplete])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = arenaRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const handleRestart = useCallback(() => {
    scoreRef.current = 0
    caughtRef.current = false
    setScore(0)
    setCaught(false)
    setCompletionResult(null)
    startBall()
  }, [startBall])

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
    <div className="cbs">
      <div className="cbs-topbar">
        <BackButton onClick={onBack} />
        <span className="cbs-title">{game.emoji} {game.title}</span>
        <span className="cbs-score">{score}/{TOTAL}</span>
      </div>
      <ProgressBar percent={(score / TOTAL) * 100} />

      <div className="cbs-instruction">
        Hover over the ball to catch it!
      </div>

      <div
        className="cbs-arena"
        ref={arenaRef}
        onMouseMove={handleMouseMove}
      >
        <div
          ref={ballRef}
          className={`cbs-ball ${caught ? 'cbs-ball--caught' : ''}`}
          style={{ width: BALL_SIZE, height: BALL_SIZE }}
        >
          🎾
        </div>
      </div>
    </div>
  )
}

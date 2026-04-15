import './DinoGameScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { BackButton } from '../components/ui/BackButton'
import { Button } from '../components/ui/Button'
import { useSoundEffects } from '../hooks/useSoundEffects'

// Logical canvas dimensions
const GAME_W = 800
const GAME_H = 220
const GROUND_Y = 172      // y-position of the ground surface

// Character
const CHAR_X = 80
const CHAR_W = 52
const CHAR_H = 62

// Physics
const JUMP_VEL = 13.5
const GRAVITY = 0.65

// Obstacles
const OBS_W = 36
const OBS_MIN_H = 55
const OBS_MAX_H = 105

// Speed
const START_SPEED = 4
const MAX_SPEED = 13
const SPEED_ACCEL = 0.004  // per frame

// Spawning
const OBS_MIN_GAP = 360    // px between obstacles
const OBS_MAX_GAP = 680

// Gameplay
const MAX_HEARTS = 3
const INVINCIBLE_FRAMES = 90   // blink frames after a hit

interface Obstacle {
  x: number
  height: number
}

interface GameState {
  charY: number        // height above ground (0 = standing, positive = airborne)
  velY: number         // upward velocity
  isGrounded: boolean
  obstacles: Obstacle[]
  speed: number
  nextObstacle: number // distance until next obstacle spawns
  invincible: number   // countdown frames
  hearts: number
  frameCount: number
  running: boolean
}

interface DinoGameScreenProps {
  onBack: () => void
}

export function DinoGameScreen({ onBack }: DinoGameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const stateRef = useRef<GameState>({
    charY: 0, velY: 0, isGrounded: true,
    obstacles: [], speed: START_SPEED, nextObstacle: 450,
    invincible: 0, hearts: MAX_HEARTS, frameCount: 0, running: false,
  })

  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState(0)

  const { playWrong } = useSoundEffects()

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const s = stateRef.current

    ctx.clearRect(0, 0, GAME_W, GAME_H)

    // Background
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, GAME_W, GAME_H)

    // Scrolling ground dashes
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, GROUND_Y + 3, GAME_W, 3)
    ctx.fillStyle = '#333'
    const dashOffset = (s.frameCount * s.speed * 0.4) % 80
    for (let x = -dashOffset; x < GAME_W; x += 80) {
      ctx.fillRect(x, GROUND_Y + 8, 40, 2)
    }

    // Character (blink when invincible)
    const showChar = s.invincible === 0 || Math.floor(s.invincible / 7) % 2 === 0
    if (showChar) {
      const feetY = GROUND_Y - s.charY   // canvas y of character feet
      ctx.font = `${CHAR_H}px serif`
      ctx.textBaseline = 'bottom'
      ctx.fillText('🦕', CHAR_X, feetY)
    }

    // Obstacles (cactus style)
    for (const obs of s.obstacles) {
      const obsTop = GROUND_Y - obs.height

      // Trunk
      ctx.fillStyle = '#2d8a0c'
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(obs.x, obsTop, OBS_W, obs.height, 4)
      } else {
        ctx.rect(obs.x, obsTop, OBS_W, obs.height)
      }
      ctx.fill()

      // Top knob
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(obs.x - 7, obsTop - 12, OBS_W + 14, 16, 6)
      } else {
        ctx.rect(obs.x - 7, obsTop - 12, OBS_W + 14, 16)
      }
      ctx.fill()

      // Side arms
      const armY = obsTop + obs.height * 0.35
      ctx.fillRect(obs.x - 18, armY, 20, 9)
      ctx.fillRect(obs.x + OBS_W - 2, armY + 10, 20, 9)
    }

    // Hearts (top-left)
    ctx.font = '26px serif'
    ctx.textBaseline = 'top'
    for (let i = 0; i < MAX_HEARTS; i++) {
      ctx.globalAlpha = i < s.hearts ? 1 : 0.2
      ctx.fillText('❤️', 14 + i * 36, 10)
    }
    ctx.globalAlpha = 1

    // Score (top-right)
    ctx.fillStyle = '#888'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText(`${Math.floor(s.frameCount / 6)}m`, GAME_W - 14, 12)
    ctx.textAlign = 'left'
  }, [])

  const jump = useCallback(() => {
    const s = stateRef.current
    if (!s.running || !s.isGrounded) return
    s.velY = JUMP_VEL
    s.charY = 0.5
    s.isGrounded = false
  }, [])

  const loop = useCallback(() => {
    const s = stateRef.current
    if (!s.running) return

    s.frameCount++
    s.speed = Math.min(MAX_SPEED, START_SPEED + s.frameCount * SPEED_ACCEL)

    // Physics
    s.velY -= GRAVITY
    s.charY += s.velY
    if (s.charY <= 0) {
      s.charY = 0
      s.velY = 0
      s.isGrounded = true
    }

    // Spawn obstacles
    s.nextObstacle -= s.speed
    if (s.nextObstacle <= 0) {
      const h = OBS_MIN_H + Math.random() * (OBS_MAX_H - OBS_MIN_H)
      s.obstacles.push({ x: GAME_W + 20, height: h })
      s.nextObstacle = OBS_MIN_GAP + Math.random() * (OBS_MAX_GAP - OBS_MIN_GAP)
    }

    for (const obs of s.obstacles) obs.x -= s.speed
    s.obstacles = s.obstacles.filter((o) => o.x > -OBS_W - 60)

    // Collision
    if (s.invincible > 0) {
      s.invincible--
    } else {
      // Tight hitbox for fairness
      const margin = 10
      const charL = CHAR_X + margin
      const charR = CHAR_X + CHAR_W - margin
      const charB = GROUND_Y - s.charY - margin
      const charT = charB - CHAR_H + margin * 2

      for (const obs of s.obstacles) {
        const obsL = obs.x
        const obsR = obs.x + OBS_W
        const obsTop = GROUND_Y - obs.height

        if (charR > obsL && charL < obsR && charB > obsTop && charT < GROUND_Y) {
          s.invincible = INVINCIBLE_FRAMES
          s.hearts -= 1
          setHearts(s.hearts)
          playWrong()
          if (s.hearts <= 0) {
            s.running = false
            setGameOver(true)
          }
          break
        }
      }
    }

    if (s.frameCount % 10 === 0) setScore(Math.floor(s.frameCount / 6))

    draw()
    if (s.running) {
      rafRef.current = requestAnimationFrame(loop)
    }
  }, [draw, playWrong])

  const startGame = useCallback(() => {
    const s = stateRef.current
    Object.assign(s, {
      charY: 0, velY: 0, isGrounded: true,
      obstacles: [], speed: START_SPEED, nextObstacle: 450,
      invincible: 0, hearts: MAX_HEARTS, frameCount: 0, running: true,
    })
    setHearts(MAX_HEARTS)
    setGameOver(false)
    setScore(0)
    setStarted(true)

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  // Draw initial idle frame
  useEffect(() => {
    draw()
  }, [draw])

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (!started || gameOver) startGame()
        else jump()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, gameOver, startGame, jump])

  const handlePointer = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      if (!started || gameOver) startGame()
      else jump()
    },
    [started, gameOver, startGame, jump],
  )

  return (
    <div className="dino-game">
      <div className="dino-topbar">
        <BackButton onClick={onBack} />
        <span className="dino-title">🦕 Dino Run</span>
      </div>

      <div className="dino-canvas-wrap" onPointerDown={handlePointer}>
        <canvas ref={canvasRef} width={GAME_W} height={GAME_H} className="dino-canvas" />

        {!started && (
          <div className="dino-overlay">
            <div className="dino-overlay-text">Tap or press Space to start!</div>
          </div>
        )}

        {gameOver && (
          <div className="dino-overlay">
            <div className="dino-gameover-emoji">💀</div>
            <div className="dino-gameover-title">Game Over!</div>
            <div className="dino-gameover-score">{score}m</div>
            <Button variant="primary" onClick={startGame}>
              Play Again
            </Button>
          </div>
        )}
      </div>

      <div className="dino-hearts">
        {Array.from({ length: MAX_HEARTS }, (_, i) => (
          <span key={i} className={`dino-heart ${i < hearts ? '' : 'dino-heart--lost'}`}>
            ❤️
          </span>
        ))}
      </div>

      <p className="dino-hint">Tap screen or press Space to jump!</p>
    </div>
  )
}

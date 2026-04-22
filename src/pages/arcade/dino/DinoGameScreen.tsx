import './DinoGameScreen.css'

import { CoreBox, CoreButton, CoreScreen, CoreText, Spacing } from '@core'
import { useSoundEffects } from '@hooks/useSoundEffects'
import { useCallback, useEffect, useRef, useState } from 'react'

// Logical canvas dimensions
const GAME_W = 800
const GAME_H = 480
const GROUND_Y = 380 // y-position of the ground surface

// Character
const CHAR_X = 80
const CHAR_W = 52
const CHAR_H = 72

// Physics
const JUMP_VEL = 13
const GRAVITY = 0.3

// Obstacles
const OBS_W = 36
const OBS_MIN_H = 60
const OBS_MAX_H = 115

// Speed
const SPEED = 3

// Spawning
const OBS_MIN_GAP = 360 // px between obstacles
const OBS_MAX_GAP = 680

// Gameplay
const MAX_HEARTS = 3
const INVINCIBLE_FRAMES = 90 // blink frames after a hit

interface Obstacle {
  x: number
  height: number
}

interface Coin {
  x: number
  y: number // canvas y (fixed height above ground)
}

interface GameState {
  charY: number // height above ground (0 = standing, positive = airborne)
  velY: number // upward velocity
  isGrounded: boolean
  obstacles: Obstacle[]
  coins: Coin[]
  nextCoin: number // frames until next coin spawns
  speed: number
  nextObstacle: number // distance until next obstacle spawns
  invincible: number // countdown frames
  hearts: number
  coins_collected: number
  frameCount: number
  running: boolean
}

interface DinoGameScreenProps {
  onBack: () => void
}

export function DinoGameScreen({ onBack }: DinoGameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const loopRef = useRef<(() => void) | undefined>(undefined)
  const stateRef = useRef<GameState>({
    charY: 0,
    velY: 0,
    isGrounded: true,
    obstacles: [],
    coins: [],
    nextCoin: 120,
    speed: SPEED,
    nextObstacle: 450,
    invincible: 0,
    hearts: MAX_HEARTS,
    coins_collected: 0,
    frameCount: 0,
    running: false,
  })

  const [, setHearts] = useState(MAX_HEARTS)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [coinsCollected, setCoinsCollected] = useState(0)

  const { playWrong } = useSoundEffects()

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    const s = stateRef.current

    ctx.clearRect(0, 0, GAME_W, GAME_H)

    // Background
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, GAME_W, GAME_H)

    // Ground
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, GROUND_Y + 3, GAME_W, GAME_H - GROUND_Y)
    ctx.fillStyle = '#444'
    ctx.fillRect(0, GROUND_Y + 3, GAME_W, 3)
    ctx.fillStyle = '#333'
    const dashOffset = (s.frameCount * s.speed * 0.4) % 80
    for (let x = -dashOffset; x < GAME_W; x += 80) {
      ctx.fillRect(x, GROUND_Y + 10, 40, 2)
    }

    // Character (blink when invincible, flip to face right)
    const showChar = s.invincible === 0 || Math.floor(s.invincible / 7) % 2 === 0
    if (showChar) {
      const feetY = GROUND_Y - s.charY
      ctx.save()
      ctx.scale(-1, 1)
      ctx.font = `${CHAR_H}px serif`
      ctx.textBaseline = 'bottom'
      ctx.fillText('🦕', -(CHAR_X + CHAR_W), feetY)
      ctx.restore()
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

    // Coins (⭐)
    ctx.font = '28px serif'
    ctx.textBaseline = 'middle'
    for (const coin of s.coins) {
      ctx.fillText('⭐', coin.x, coin.y)
    }

    // Hearts (top-left)
    ctx.font = '26px serif'
    ctx.textBaseline = 'top'
    for (let i = 0; i < MAX_HEARTS; i++) {
      ctx.globalAlpha = i < s.hearts ? 1 : 0.2
      ctx.fillText('❤️', 14 + i * 36, 10)
    }
    ctx.globalAlpha = 1

    // Stars collected (top-right)
    ctx.font = '24px serif'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'right'
    ctx.fillText(`⭐ ${s.coins_collected}`, GAME_W - 14, 12)
    ctx.textAlign = 'left'
  }, [])

  const jump = useCallback(() => {
    const s = stateRef.current
    if (!s.running || !s.isGrounded) {
      return
    }
    s.velY = JUMP_VEL
    s.charY = 0.5
    s.isGrounded = false
  }, [])

  const loop = useCallback(() => {
    const s = stateRef.current
    if (!s.running) {
      return
    }

    s.frameCount++
    s.speed = SPEED

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

    s.obstacles = s.obstacles
      .map((o) => ({ ...o, x: o.x - s.speed }))
      .filter((o) => o.x > -OBS_W - 60)

    // Spawn coins at varying heights
    s.nextCoin -= s.speed
    if (s.nextCoin <= 0) {
      const heightAboveGround = 60 + Math.random() * 100
      s.coins.push({ x: GAME_W + 20, y: GROUND_Y - heightAboveGround })
      s.nextCoin = 200 + Math.random() * 300
    }
    s.coins = s.coins.map((c) => ({ ...c, x: c.x - s.speed }))
    // Collect coins
    const charFeetY = GROUND_Y - s.charY
    const charTopY = charFeetY - CHAR_H
    const charMidX = CHAR_X + CHAR_W / 2
    s.coins = s.coins.filter((coin) => {
      const dx = Math.abs(coin.x + 14 - charMidX)
      const dy = Math.abs(coin.y - (charTopY + CHAR_H / 2))
      if (dx < 36 && dy < 36) {
        s.coins_collected++
        setCoinsCollected(s.coins_collected)
        return false
      }
      return coin.x > -40
    })

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

    draw()
    if (s.running) {
      rafRef.current = requestAnimationFrame(() => loopRef.current?.())
    }
  }, [draw, playWrong])

  useEffect(() => {
    loopRef.current = loop
  }, [loop])

  const startGame = useCallback(() => {
    const s = stateRef.current
    Object.assign(s, {
      charY: 0,
      velY: 0,
      isGrounded: true,
      obstacles: [],
      coins: [],
      nextCoin: 120,
      speed: SPEED,
      nextObstacle: 450,
      invincible: 0,
      hearts: MAX_HEARTS,
      coins_collected: 0,
      frameCount: 0,
      running: true,
    })
    setHearts(MAX_HEARTS)
    setGameOver(false)
    setCoinsCollected(0)
    setStarted(true)

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => loopRef.current?.())
  }, [])

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
      if (e.repeat) {
        return
      }
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (!started || gameOver) {
          startGame()
        } else {
          jump()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, gameOver, startGame, jump])

  const handlePointer = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      if (!started || gameOver) {
        startGame()
      } else {
        jump()
      }
    },
    [started, gameOver, startGame, jump],
  )

  return (
    <CoreScreen center padding={Spacing.md} gap={Spacing.md} className="dino-game">
      <div className="dino-topbar">
        <CoreButton variant="ghost" aria-label="Back" onClick={onBack}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </CoreButton>
        <CoreBox flex={1}>
          <CoreText size="h3">🦕 Dino Run</CoreText>
        </CoreBox>
      </div>

      <div className="dino-canvas-area">
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
              <div className="dino-gameover-score">⭐ {coinsCollected}</div>
              <CoreButton variant="primary" onClick={startGame}>
                Play Again
              </CoreButton>
            </div>
          )}
        </div>

        <CoreText size="sm" color="muted">
          Tap screen or press Space to jump!
        </CoreText>
      </div>
    </CoreScreen>
  )
}

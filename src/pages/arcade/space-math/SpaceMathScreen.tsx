import './SpaceMathScreen.css'

import { Confetti } from '@common/components/Confetti/Confetti'
import { GameShell } from '@common/components/GameShell/GameShell'
import { useSoundEffects } from '@hooks/useSoundEffects'
import { useCallback, useEffect, useRef, useState } from 'react'

/* ── Constants ──────────────────────────────────────── */
const COLS = 5
const ROWS = 2
const INV_W = 60 // px
const INV_H = 56 // px
const INV_GAP_X = 14
const INV_GAP_Y = 12
const MARCH_SPEED = 0.4 // px / frame
const DROP_AMOUNT = 28 // px per wall-hit
const BULLET_SPD = 9 // px / frame upward
const CANNON_SPD = 5 // px / frame
const LIVES_START = 3
const WIN_SCORE = 10

const EMOJIS_ADD = ['🍎', '⭐', '🌸', '🐠', '🍪', '🎈'] as const

interface Question {
  left: number
  right: number
  answer: number
}

function makeQuestion(): Question {
  const left = Math.floor(Math.random() * 4) + 1 // 1–4
  const right = Math.floor(Math.random() * 4) + 1 // 1–4
  return { left, right, answer: left + right }
}

interface Invader {
  id: number
  num: number
  alive: boolean
}

function makeInvaders(answer: number): Invader[] {
  // Fill 10 slots with numbers 1–9, ensuring the answer is present
  const nums = new Array<number>(COLS * ROWS).fill(0)
  // Place answer in a random slot
  const answerSlot = Math.floor(Math.random() * nums.length)
  nums[answerSlot] = answer
  // Fill rest with random 1-9 (may repeat, but not matching answer in same slot)
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      let n: number
      do {
        n = Math.floor(Math.random() * 9) + 1
      } while (n === answer)
      nums[i] = n
    }
  }
  return nums.map((num, id) => ({ id, num, alive: true }))
}

interface Bullet {
  x: number
  y: number
}
interface Props {
  onBack: () => void
}

export function SpaceMathScreen({ onBack }: Props) {
  const arenaRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const sfxRef = useRef<ReturnType<typeof useSoundEffects> | null>(null)

  // RAF-synced refs
  const invRef = useRef<Invader[]>([])
  const invXRef = useRef(0) // x offset of whole grid
  const invDirRef = useRef(1) // 1 = right, -1 = left
  const invYRef = useRef(0) // y offset from initial position
  const bulletRef = useRef<Bullet | null>(null)
  const cannonXRef = useRef(0) // center x of cannon
  const keysRef = useRef({ left: false, right: false, fire: false })
  const livesRef = useRef(LIVES_START)
  const scoreRef = useRef(0)
  const questionRef = useRef<Question>(makeQuestion())
  const phaseRef = useRef<'playing' | 'win' | 'lose'>('playing')

  const [lives, setLives] = useState(LIVES_START)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<Question>(makeQuestion)
  const [phase, setPhase] = useState<'playing' | 'win' | 'lose'>('playing')
  const [invState, setInvState] = useState<Invader[]>([])
  const [cannonX, setCannonX] = useState(0)
  const [bullet, setBullet] = useState<Bullet | null>(null)
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)
  const [arenaW, setArenaW] = useState(360)
  const [renderInvX, setRenderInvX] = useState(0)
  const [renderInvY, setRenderInvY] = useState(0)

  const sfx = useSoundEffects()
  useEffect(() => {
    sfxRef.current = sfx
  })

  const resetInvaders = useCallback((q: Question) => {
    const fresh = makeInvaders(q.answer)
    invRef.current = fresh
    invXRef.current = 0
    invYRef.current = 0
    invDirRef.current = 1
    setInvState([...fresh])
  }, [])

  // Derived: invader grid top-left in arena coords
  const gridW = COLS * INV_W + (COLS - 1) * INV_GAP_X
  const gridH = ROWS * INV_H + (ROWS - 1) * INV_GAP_Y
  const ARENA_H = 460

  const getArenaW = () => arenaRef.current?.clientWidth ?? 360

  const startGame = useCallback(() => {
    const q = makeQuestion()
    questionRef.current = q
    phaseRef.current = 'playing'
    livesRef.current = LIVES_START
    scoreRef.current = 0
    bulletRef.current = null
    keysRef.current = { left: false, right: false, fire: false }
    const arenaW = getArenaW()
    cannonXRef.current = arenaW / 2

    resetInvaders(q)
    setLives(LIVES_START)
    setScore(0)
    setQuestion(q)
    setPhase('playing')
    setBullet(null)
    setCannonX(arenaW / 2)
    setFlash(null)
  }, [resetInvaders])

  useEffect(() => {
    const id = setTimeout(startGame, 0)
    return () => clearTimeout(id)
  }, [startGame])

  useEffect(() => {
    const el = arenaRef.current
    if (!el) {
      return
    }
    const ro = new ResizeObserver(() => setArenaW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // RAF loop
  useEffect(() => {
    let lastFired = false

    const tick = () => {
      if (phaseRef.current !== 'playing') {
        return
      }

      const arenaW = getArenaW()
      const CANNON_Y = ARENA_H - 48

      // ── Move cannon ──────────────────────────────────
      const keys = keysRef.current
      if (keys.left) {
        cannonXRef.current = Math.max(24, cannonXRef.current - CANNON_SPD)
      }
      if (keys.right) {
        cannonXRef.current = Math.min(arenaW - 24, cannonXRef.current + CANNON_SPD)
      }
      setCannonX(cannonXRef.current)

      // ── Fire bullet ──────────────────────────────────
      if (keys.fire && !lastFired && !bulletRef.current) {
        bulletRef.current = { x: cannonXRef.current, y: CANNON_Y - 20 }
        lastFired = true
      }
      if (!keys.fire) {
        lastFired = false
      }

      // ── Move bullet ──────────────────────────────────
      let blt = bulletRef.current
      if (blt) {
        blt = { ...blt, y: blt.y - BULLET_SPD }
        if (blt.y < 0) {
          bulletRef.current = null
          blt = null
        } else {
          bulletRef.current = blt
        }
        setBullet(bulletRef.current)
      }

      // ── Move invaders ─────────────────────────────────
      const initialX = (arenaW - gridW) / 2
      invXRef.current += MARCH_SPEED * invDirRef.current

      const leftEdge = initialX + invXRef.current
      const rightEdge = leftEdge + gridW

      if (invDirRef.current === 1 && rightEdge > arenaW - 8) {
        invDirRef.current = -1
        invYRef.current += DROP_AMOUNT
      } else if (invDirRef.current === -1 && leftEdge < 8) {
        invDirRef.current = 1
        invYRef.current += DROP_AMOUNT
      }

      // ── Bullet–invader collision ──────────────────────
      if (blt) {
        const invs = invRef.current
        let hit = false
        for (let row = 0; row < ROWS && !hit; row++) {
          for (let col = 0; col < COLS && !hit; col++) {
            const idx = row * COLS + col
            const inv = invs[idx]
            if (!inv || !inv.alive) {
              continue
            }

            const ix = initialX + invXRef.current + col * (INV_W + INV_GAP_X)
            const iy = 60 + invYRef.current + row * (INV_H + INV_GAP_Y)

            if (blt.x >= ix && blt.x <= ix + INV_W && blt.y >= iy && blt.y <= iy + INV_H) {
              hit = true
              bulletRef.current = null
              setBullet(null)

              if (inv.num === questionRef.current.answer) {
                // Correct!
                sfxRef.current?.playCorrect()
                inv.alive = false
                scoreRef.current += 1
                setScore(scoreRef.current)
                setFlash('correct')
                setTimeout(() => setFlash(null), 350)

                if (scoreRef.current >= WIN_SCORE) {
                  phaseRef.current = 'win'
                  setPhase('win')
                  return
                }

                const q = makeQuestion()
                questionRef.current = q
                setQuestion(q)
                resetInvaders(q)
              } else {
                // Wrong!
                sfxRef.current?.playWrong()
                livesRef.current -= 1
                setLives(livesRef.current)
                setFlash('wrong')
                setTimeout(() => setFlash(null), 350)
                if (livesRef.current <= 0) {
                  phaseRef.current = 'lose'
                  setPhase('lose')
                  return
                }
              }
            }
          }
        }
      }

      // ── Invaders reach bottom ──────────────────────────
      const invBottom = 60 + invYRef.current + gridH
      if (invBottom >= CANNON_Y - 10) {
        livesRef.current -= 1
        setLives(livesRef.current)
        if (livesRef.current <= 0) {
          phaseRef.current = 'lose'
          setPhase('lose')
          return
        }
        // Reset grid position
        invXRef.current = 0
        invYRef.current = 0
        invDirRef.current = 1
      }

      setInvState([...invRef.current])
      setRenderInvX(invXRef.current)
      setRenderInvY(invYRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [gridW, gridH, resetInvaders])

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        keysRef.current.left = true
      }
      if (e.key === 'ArrowRight') {
        keysRef.current.right = true
      }
      if (e.key === ' ') {
        e.preventDefault()
        keysRef.current.fire = true
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        keysRef.current.left = false
      }
      if (e.key === 'ArrowRight') {
        keysRef.current.right = false
      }
      if (e.key === ' ') {
        keysRef.current.fire = false
      }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  const initialX = (arenaW - gridW) / 2

  return (
    <GameShell onBack={onBack} percent={(score / WIN_SCORE) * 100} score={score} className="spmath">
      {phase === 'win' && <Confetti />}

      {/* Lives */}
      <div className="spmath-lives">
        {Array.from({ length: LIVES_START }, (_, i) => (
          <span key={i} className={`spmath-heart ${i < lives ? '' : 'spmath-heart--lost'}`}>
            ❤️
          </span>
        ))}
      </div>

      {/* Question */}
      <div
        className={`spmath-question ${flash === 'correct' ? 'spmath-question--correct' : flash === 'wrong' ? 'spmath-question--wrong' : ''}`}
      >
        <div className="spmath-eq">
          {Array.from({ length: question.left }, (_, i) => (
            <span key={i} className="spmath-emoji">
              {EMOJIS_ADD[question.left % EMOJIS_ADD.length]}
            </span>
          ))}
          <span className="spmath-op">+</span>
          {Array.from({ length: question.right }, (_, i) => (
            <span key={i} className="spmath-emoji">
              {EMOJIS_ADD[question.right % EMOJIS_ADD.length]}
            </span>
          ))}
          <span className="spmath-op">=</span>
          <span className="spmath-ans">?</span>
        </div>
      </div>

      {/* Arena */}
      <div className="spmath-arena" ref={arenaRef}>
        {/* Invaders */}
        {invState.map((inv, idx) => {
          if (!inv.alive) {
            return null
          }
          const row = Math.floor(idx / COLS)
          const col = idx % COLS
          const x = initialX + renderInvX + col * (INV_W + INV_GAP_X)
          const y = 60 + renderInvY + row * (INV_H + INV_GAP_Y)
          return (
            <div key={inv.id} className="spmath-invader" style={{ left: x, top: y }}>
              <div className="spmath-inv-ship">👾</div>
              <div className="spmath-inv-num">{inv.num}</div>
            </div>
          )
        })}

        {/* Bullet */}
        {bullet && <div className="spmath-bullet" style={{ left: bullet.x - 4, top: bullet.y }} />}

        {/* Cannon */}
        <div className="spmath-cannon" style={{ left: cannonX - 24 }}>
          🚀
        </div>

        {/* Win / Lose overlay */}
        {phase !== 'playing' && (
          <div className="spmath-overlay">
            <div className="spmath-overlay-card">
              <div className="spmath-overlay-emoji">{phase === 'win' ? '🏆' : '💥'}</div>
              <div className="spmath-overlay-title">
                {phase === 'win' ? 'You win!' : 'Game over!'}
              </div>
              <div className="spmath-overlay-score">Score: {score}</div>
              <button className="spmath-overlay-btn" onClick={startGame}>
                {phase === 'win' ? 'Play again!' : 'Try again!'}
              </button>
              <button className="spmath-overlay-btn spmath-overlay-btn--back" onClick={onBack}>
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* D-pad controls */}
      {phase === 'playing' && (
        <div className="spmath-controls">
          <button
            className="spmath-ctrl-btn"
            onPointerDown={() => {
              keysRef.current.left = true
            }}
            onPointerUp={() => {
              keysRef.current.left = false
            }}
            onPointerLeave={() => {
              keysRef.current.left = false
            }}
          >
            ◀
          </button>
          <button
            className="spmath-ctrl-btn spmath-ctrl-fire"
            onPointerDown={() => {
              keysRef.current.fire = true
            }}
            onPointerUp={() => {
              keysRef.current.fire = false
            }}
            onPointerLeave={() => {
              keysRef.current.fire = false
            }}
          >
            🔥
          </button>
          <button
            className="spmath-ctrl-btn"
            onPointerDown={() => {
              keysRef.current.right = true
            }}
            onPointerUp={() => {
              keysRef.current.right = false
            }}
            onPointerLeave={() => {
              keysRef.current.right = false
            }}
          >
            ▶
          </button>
        </div>
      )}
    </GameShell>
  )
}

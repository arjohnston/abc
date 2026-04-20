import './FroggerScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Confetti } from '../components/Confetti'
import { Button } from '../components/ui/Button'
import { GameTopbar } from '../components/ui/GameTopbar'
import { useSoundEffects } from '../hooks/useSoundEffects'

const ROWS = 6       // 0 = goal, 1-4 = road, 5 = start
const COLS = 7
const CELL_H = 96    // px per row
const GOAL_SCORE = 5

interface Car {
  row: number
  x: number        // px from left edge of arena
  speed: number    // px/frame (positive = right, negative = left)
  width: number    // px
  emoji: string
}

interface Pos { row: number; col: number }
const START: Pos = { row: ROWS - 1, col: Math.floor(COLS / 2) } // col 4 of 9

// Hardcoded for ~360px wide arena — will wrap naturally once RAF starts
const INITIAL_CARS: Car[] = [
  { row: 1, x: 10,  speed: 0.6,  width: 66, emoji: '🚗' },
  { row: 1, x: 210, speed: 0.6,  width: 66, emoji: '🚗' },
  { row: 2, x: 280, speed: -0.7, width: 66, emoji: '🚕' },
  { row: 2, x: 80,  speed: -0.7, width: 66, emoji: '🚕' },
  { row: 3, x: 50,  speed: 0.85, width: 70, emoji: '🚙' },
  { row: 3, x: 250, speed: 0.85, width: 70, emoji: '🚙' },
  { row: 4, x: 30,  speed: -0.5, width: 98, emoji: '🚛' },
  { row: 4, x: 230, speed: -0.5, width: 98, emoji: '🚛' },
]

interface Props { onBack: () => void }

export function FroggerScreen({ onBack }: Props) {
  const arenaRef    = useRef<HTMLDivElement>(null)
  const carDivRefs  = useRef<(HTMLDivElement | null)[]>([])
  const carsRef     = useRef<Car[]>(INITIAL_CARS.map(c => ({ ...c })))
  const frogRef     = useRef<Pos>({ ...START })
  const scoreRef    = useRef(0)
  const hitRef      = useRef(false)
  const rafRef      = useRef<number>(0)

  const [frogPos, setFrogPos] = useState<Pos>({ ...START })
  const [score, setScore]     = useState(0)
  const [done, setDone]       = useState(false)
  const [hit, setHit]         = useState(false)

  const { playCorrect, playWrong, playComplete } = useSoundEffects()

  // Keep sound refs current so the RAF loop can call them without stale closures
  const sfxRef = useRef({ playWrong, playCorrect, playComplete })
  sfxRef.current = { playWrong, playCorrect, playComplete }

  // Shared move logic used by both keyboard and D-pad
  const move = useCallback((dr: number, dc: number) => {
    if (hitRef.current || done) return
    const { row, col } = frogRef.current
    const newRow = Math.max(0, Math.min(ROWS - 1, row + dr))
    const newCol = Math.max(0, Math.min(COLS - 1, col + dc))
    if (newRow === row && newCol === col) return

    if (newRow === 0) {
      // Reached the goal!
      const newScore = scoreRef.current + 1
      scoreRef.current = newScore
      sfxRef.current.playCorrect()
      frogRef.current = { ...START }
      setScore(newScore)
      if (newScore >= GOAL_SCORE) {
        setDone(true)
        sfxRef.current.playComplete()
      } else {
        setFrogPos({ ...START })
      }
      return
    }

    frogRef.current = { row: newRow, col: newCol }
    setFrogPos({ row: newRow, col: newCol })
  }, [done])

  // Keyboard input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      const deltas: Record<string, [number, number]> = {
        ArrowUp: [-1, 0], ArrowDown: [1, 0],
        ArrowLeft: [0, -1], ArrowRight: [0, 1],
      }
      const d = deltas[e.key]
      if (!d) return
      e.preventDefault()
      move(d[0], d[1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move])

  // RAF game loop — cars + collision
  useEffect(() => {
    function loop() {
      const arena = arenaRef.current
      if (!arena) { rafRef.current = requestAnimationFrame(loop); return }

      const arenaW = arena.offsetWidth
      const cars   = carsRef.current

      // Move cars + update DOM directly
      for (let i = 0; i < cars.length; i++) {
        const car = cars[i]!
        car.x += car.speed
        if (car.speed > 0 && car.x > arenaW)          car.x = -car.width
        if (car.speed < 0 && car.x + car.width < 0)   car.x = arenaW
        const div = carDivRefs.current[i]
        if (div) div.style.left = `${car.x}px`
      }

      // Collision check — fixed pixel radius so it doesn't depend on COLS
      if (!hitRef.current) {
        const frog = frogRef.current
        if (frog.row >= 1 && frog.row <= ROWS - 2) {
          const frogCx = (frog.col + 0.5) / COLS * arenaW
          const FROG_R = 18 // px, fixed regardless of column count
          const frogL = frogCx - FROG_R
          const frogR = frogCx + FROG_R
          for (const car of cars) {
            const carL = car.x + car.width * 0.2
            const carR = car.x + car.width * 0.8
            if (car.row === frog.row && frogL < carR && frogR > carL) {
              hitRef.current = true
              sfxRef.current.playWrong()
              setHit(true)
              setTimeout(() => {
                frogRef.current = { ...START }
                setFrogPos({ ...START })
                setHit(false)
                hitRef.current = false
              }, 700)
              break
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, []) // runs once on mount

  const restart = useCallback(() => {
    scoreRef.current = 0
    hitRef.current   = false
    frogRef.current  = { ...START }
    carsRef.current  = INITIAL_CARS.map(c => ({ ...c }))
    setScore(0)
    setDone(false)
    setHit(false)
    setFrogPos({ ...START })
  }, [])

  return (
    <div className="game-shell fg">
      <GameTopbar onBack={onBack} percent={(score / GOAL_SCORE) * 100} score={score} />

      {done && <Confetti />}

      {done ? (
        <div className="fg-complete">
          <div className="fg-complete-emoji">🐸</div>
          <h2 className="fg-complete-title">You made it!</h2>
          <p className="fg-complete-sub">Crossed {GOAL_SCORE} times!</p>
          <div className="fg-complete-actions">
            <Button variant="primary" onClick={restart}>Play Again</Button>
            <Button variant="secondary" onClick={onBack}>Home</Button>
          </div>
        </div>
      ) : (
        <div className="fg-content">
          <div className="fg-arena" ref={arenaRef}>
            {/* Lane backgrounds */}
            {Array.from({ length: ROWS }, (_, i) => (
              <div
                key={i}
                className={`fg-lane ${i === 0 ? 'fg-lane--goal' : i === ROWS - 1 ? 'fg-lane--start' : i % 2 === 0 ? 'fg-lane--road-a' : 'fg-lane--road-b'}`}
                style={{ height: CELL_H }}
              >
                {i === 0         && <span className="fg-zone-label">🏁 Cross here!</span>}
                {i === ROWS - 1  && <span className="fg-zone-label">🌿 Start</span>}
              </div>
            ))}

            {/* Cars — positioned absolutely, moved via RAF */}
            {INITIAL_CARS.map((car, i) => (
              <div
                key={i}
                ref={el => { carDivRefs.current[i] = el }}
                className="fg-car"
                style={{
                  top: car.row * CELL_H + (CELL_H - 54) / 2,
                  left: car.x,
                  width: car.width,
                }}
              >
                <span style={{ display: 'inline-block', transform: car.speed < 0 ? 'scaleX(-1)' : 'none' }}>
                  {car.emoji}
                </span>
              </div>
            ))}

            {/* Frog */}
            <div
              className={`fg-frog ${hit ? 'fg-frog--hit' : ''}`}
              style={{
                top:  frogPos.row * CELL_H + CELL_H / 2,
                left: `${(frogPos.col + 0.5) / COLS * 100}%`,
              }}
            >
              🐸
            </div>
          </div>

          {/* On-screen D-pad for touch/tablet */}
          <div className="fg-dpad">
            <button className="fg-dpad-btn fg-dpad-up"    onClick={() => move(-1,  0)}>↑</button>
            <button className="fg-dpad-btn fg-dpad-left"  onClick={() => move( 0, -1)}>←</button>
            <button className="fg-dpad-btn fg-dpad-right" onClick={() => move( 0,  1)}>→</button>
            <button className="fg-dpad-btn fg-dpad-down"  onClick={() => move( 1,  0)}>↓</button>
          </div>
        </div>
      )}
    </div>
  )
}

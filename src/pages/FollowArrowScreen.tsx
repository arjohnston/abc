import './FollowArrowScreen.css'

import { useEffect, useRef } from 'react'

import { CoreScreen, CoreText } from '@core'
import { GameComplete } from '../components/GameComplete'
import { GameTopbar } from '../components/ui/GameTopbar'
import { useKeyInput } from '../hooks/useKeyInput'
import { useRound } from '../hooks/useRound'
import { useSpeech } from '../hooks/useSpeech'
import type { CustomGameScreenProps } from '../types/game'

const TOTAL = 12

const DIRECTIONS = ['left', 'right', 'up', 'down'] as const
type Dir = (typeof DIRECTIONS)[number]

const ARROW: Record<Dir, string> = { left: '←', right: '→', up: '↑', down: '↓' }
const KEY:   Record<Dir, string> = { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' }
const COLOR: Record<Dir, string> = { left: 'var(--blue)', right: 'var(--green)', up: 'var(--orange)', down: 'var(--purple)' }
function buildSequence(): Dir[] {
  const seq: Dir[] = []
  for (let i = 0; i < TOTAL; i++) {
    let dir: Dir
    do { dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]! }
    while (seq.length > 0 && seq[seq.length - 1] === dir)
    seq.push(dir)
  }
  return seq
}

// Stable sequence — created once per mount via useState init
import { useState } from 'react'

export function FollowArrowScreen({ onBack, onComplete }: CustomGameScreenProps) {
  const [sequence] = useState(buildSequence)
  const { score, round, feedback, lockedRef, completionResult, advance, flashWrong, restart } = useRound(TOTAL, onComplete)
  const speak = useSpeech()

  const currentDir = sequence[round] ?? sequence[TOTAL - 1]!

  // Speak once on mount only
  const spokenRef = useRef(false)
  useEffect(() => {
    if (!spokenRef.current) { spokenRef.current = true; speak('Press the matching arrow key!') }
  }, [speak])

  useKeyInput((key) => {
    const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    if (!arrowKeys.includes(key)) return
    if (lockedRef.current) return
    lockedRef.current = true
    if (key === KEY[currentDir]) advance(true)
    else flashWrong()
  })

  if (completionResult) {
    return <GameComplete score={score} total={TOTAL} stars={completionResult.stars} isNewBest={completionResult.isNewBest} onRestart={restart} onHome={onBack} />
  }

  return (
    <CoreScreen className="fa">
      <GameTopbar onBack={onBack} percent={(round / TOTAL) * 100} score={score} />

      <div className="fa-arena">
        <div
          className={`fa-arrow-wrap fa-arrow-wrap--${feedback ?? 'idle'}`}
          style={{ '--arrow-color': COLOR[currentDir] } as React.CSSProperties}
        >
          <span className="fa-arrow">{ARROW[currentDir]}</span>
        </div>

        <CoreText size="p" className="game-instruction">
          Press the <strong>{currentDir}</strong> arrow key
        </CoreText>

        <div className="fa-key-hints">
          {DIRECTIONS.map((d) => (
            <div
              key={d}
              className={`fa-key ${d === currentDir ? 'fa-key--active' : ''}`}
              style={d === currentDir ? { background: COLOR[d], borderColor: COLOR[d] } : {}}
            >
              {ARROW[d]}
            </div>
          ))}
        </div>
      </div>
    </CoreScreen>
  )
}

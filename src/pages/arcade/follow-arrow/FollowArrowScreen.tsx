import './FollowArrowScreen.css'

import { GameComplete } from '@common/components/GameComplete/GameComplete'
import { GameInstruction } from '@common/components/GameInstruction/GameInstruction'
import { GameShell } from '@common/components/GameShell/GameShell'
import type { CustomGameScreenProps } from '@common/types/game'
import { CoreText } from '@core'
import { useKeyInput } from '@hooks/useKeyInput'
import { useRound } from '@hooks/useRound'
import { useSpeech } from '@hooks/useSpeech'
import { useEffect, useRef } from 'react'

const TOTAL = 12

const DIRECTIONS = ['left', 'right', 'up', 'down'] as const
type Dir = (typeof DIRECTIONS)[number]

const ARROW: Record<Dir, string> = { left: '←', right: '→', up: '↑', down: '↓' }
const KEY: Record<Dir, string> = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  up: 'ArrowUp',
  down: 'ArrowDown',
}
const COLOR: Record<Dir, string> = {
  left: 'var(--blue)',
  right: 'var(--green)',
  up: 'var(--orange)',
  down: 'var(--purple)',
}
function buildSequence(): Dir[] {
  const seq: Dir[] = []
  for (let i = 0; i < TOTAL; i++) {
    let dir: Dir
    do {
      dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] ?? 'left'
    } while (seq.length > 0 && seq[seq.length - 1] === dir)
    seq.push(dir)
  }
  return seq
}

// Stable sequence — created once per mount via useState init
import { useState } from 'react'

export function FollowArrowScreen({ onBack, onComplete }: CustomGameScreenProps) {
  const [sequence] = useState(buildSequence)
  const { score, round, feedback, lockedRef, completionResult, advance, flashWrong, restart } =
    useRound(TOTAL, onComplete)
  const speak = useSpeech()

  const currentDir = sequence[round] ?? sequence[TOTAL - 1] ?? 'left'

  // Speak once on mount only
  const spokenRef = useRef(false)
  useEffect(() => {
    if (!spokenRef.current) {
      spokenRef.current = true
      speak('Press the matching arrow key!')
    }
  }, [speak])

  useKeyInput((key) => {
    const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    if (!arrowKeys.includes(key)) {
      return
    }
    if (lockedRef.current) {
      return
    }
    lockedRef.current = true
    if (key === KEY[currentDir]) {
      advance(true)
    } else {
      flashWrong()
    }
  })

  if (completionResult) {
    return (
      <GameComplete
        score={score}
        total={TOTAL}
        stars={completionResult.stars}
        isNewBest={completionResult.isNewBest}
        onRestart={restart}
        onHome={onBack}
      />
    )
  }

  return (
    <GameShell onBack={onBack} percent={(round / TOTAL) * 100} score={score} className="fa">
      <div className="fa-arena">
        <div
          className={`fa-arrow-wrap fa-arrow-wrap--${feedback ?? 'idle'}`}
          style={{ '--arrow-color': COLOR[currentDir] } as React.CSSProperties}
        >
          <CoreText size="sm" className="fa-arrow">
            {ARROW[currentDir]}
          </CoreText>
        </div>

        <GameInstruction>
          Press the <strong>{currentDir}</strong> arrow key
        </GameInstruction>

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
    </GameShell>
  )
}

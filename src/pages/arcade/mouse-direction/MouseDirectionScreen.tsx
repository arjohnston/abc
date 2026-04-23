import './MouseDirectionScreen.css'

import { GameComplete } from '@common/components/GameComplete/GameComplete'
import { GameInstruction } from '@common/components/GameInstruction/GameInstruction'
import { GameShell } from '@common/components/GameShell/GameShell'
import type { CustomGameScreenProps } from '@common/types/game'
import { CoreText } from '@core'
import { useRound } from '@hooks/useRound'
import { useSpeech } from '@hooks/useSpeech'
import { useEffect } from 'react'

const TOTAL = 10

const DIRECTIONS = ['left', 'right', 'up', 'down'] as const
type Dir = (typeof DIRECTIONS)[number]

const LABELS: Record<Dir, string> = { left: '← Left', right: 'Right →', up: '↑ Up', down: '↓ Down' }
const COLOR: Record<Dir, string> = {
  left: 'var(--blue)',
  right: 'var(--green)',
  up: 'var(--orange)',
  down: 'var(--purple)',
}

function pickNext(prev: Dir): Dir {
  const choices = DIRECTIONS.filter((d) => d !== prev)
  return choices[Math.floor(Math.random() * choices.length)] ?? 'left'
}

import { useRef, useState } from 'react'

export function MouseDirectionScreen({ onBack, onComplete }: CustomGameScreenProps) {
  const [currentDir, setCurrentDir] = useState<Dir>(
    () => DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] ?? 'left',
  )
  const { score, round, feedback, lockedRef, completionResult, advance, restart } = useRound(
    TOTAL,
    onComplete,
  )
  const speak = useSpeech()
  const prevDirRef = useRef(currentDir)

  const spokenRef = useRef(false)
  useEffect(() => {
    if (!spokenRef.current) {
      spokenRef.current = true
      speak('Move your mouse to the highlighted box!')
    }
  }, [speak])

  const handleHit = (dir: Dir) => {
    if (lockedRef.current || dir !== currentDir) {
      return
    }
    lockedRef.current = true
    advance(true)
    // Pick next direction after feedback clears (advance unlocks after 500ms)
    setTimeout(() => {
      const next = pickNext(prevDirRef.current)
      prevDirRef.current = next
      setCurrentDir(next)
    }, 520)
  }

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
    <GameShell onBack={onBack} percent={(round / TOTAL) * 100} score={score} className="mds">
      <GameInstruction>
        Move your mouse to the <strong>{LABELS[currentDir]}</strong> box!
      </GameInstruction>

      <div className="mds-arena">
        {DIRECTIONS.map((dir) => (
          <div
            key={dir}
            className={`mds-zone mds-zone--${dir} ${dir === currentDir ? `mds-zone--active ${feedback === 'correct' ? 'mds-zone--hit' : ''}` : 'mds-zone--dim'}`}
            style={{ '--zone-color': COLOR[dir] } as React.CSSProperties}
            onMouseEnter={() => handleHit(dir)}
          >
            <CoreText size="sm" className="mds-zone-label">
              {LABELS[dir]}
            </CoreText>
          </div>
        ))}
        <div className="mds-center">🖱️</div>
      </div>
    </GameShell>
  )
}

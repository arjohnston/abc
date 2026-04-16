import './MouseDirectionScreen.css'

import { useEffect } from 'react'

import { GameComplete } from '../components/GameComplete'
import { GameTopbar } from '../components/ui/GameTopbar'
import { useRound } from '../hooks/useRound'
import { useSpeech } from '../hooks/useSpeech'
import type { CustomGameScreenProps } from '../types/game'

const TOTAL = 10

const DIRECTIONS = ['left', 'right', 'up', 'down'] as const
type Dir = (typeof DIRECTIONS)[number]

const LABELS: Record<Dir, string> = { left: '← Left', right: 'Right →', up: '↑ Up', down: '↓ Down' }
const COLOR:  Record<Dir, string> = { left: 'var(--blue)', right: 'var(--green)', up: 'var(--orange)', down: 'var(--purple)' }
const SPEECH: Record<Dir, string> = {
  left: 'Move your mouse to the left box',   right: 'Move your mouse to the right box',
  up:   'Move your mouse to the top box',    down:  'Move your mouse to the bottom box',
}

function pickNext(prev: Dir): Dir {
  const choices = DIRECTIONS.filter((d) => d !== prev)
  return choices[Math.floor(Math.random() * choices.length)]!
}

import { useRef, useState } from 'react'

export function MouseDirectionScreen({ onBack, onComplete }: CustomGameScreenProps) {
  const [currentDir, setCurrentDir] = useState<Dir>(() => DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]!)
  const { score, round, feedback, lockedRef, completionResult, advance, restart } = useRound(TOTAL, onComplete)
  const speak = useSpeech()
  const prevDirRef = useRef(currentDir)

  useEffect(() => { speak(SPEECH[currentDir]) }, [currentDir, speak])

  const handleHit = (dir: Dir) => {
    if (lockedRef.current || dir !== currentDir) return
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
    return <GameComplete score={score} total={TOTAL} stars={completionResult.stars} isNewBest={completionResult.isNewBest} onRestart={restart} onHome={onBack} />
  }

  return (
    <div className="game-shell mds">
      <GameTopbar onBack={onBack} percent={(round / TOTAL) * 100} score={score} />

      <p className="game-instruction">
        Move your mouse to the <strong>{LABELS[currentDir]}</strong> box!
      </p>

      <div className="mds-arena">
        {DIRECTIONS.map((dir) => (
          <div
            key={dir}
            className={`mds-zone mds-zone--${dir} ${dir === currentDir ? `mds-zone--active ${feedback === 'correct' ? 'mds-zone--hit' : ''}` : 'mds-zone--dim'}`}
            style={{ '--zone-color': COLOR[dir] } as React.CSSProperties}
            onMouseEnter={() => handleHit(dir)}
          >
            <span className="mds-zone-label">{LABELS[dir]}</span>
          </div>
        ))}
        <div className="mds-center">🖱️</div>
      </div>
    </div>
  )
}

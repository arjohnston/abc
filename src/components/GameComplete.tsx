import './GameComplete.css'

import { CoreCol, CoreRow, CoreText } from './core'
import { Confetti } from './Confetti'
import { Button } from './ui/Button'

interface GameCompleteProps {
  score: number
  total: number
  stars: number
  isNewBest: boolean
  onRestart: () => void
  onHome: () => void
}

export function GameComplete({ score, total, stars, isNewBest, onRestart, onHome }: GameCompleteProps) {
  return (
    <>
      <Confetti />
      <CoreCol flex={1} align="center" justify="center" gap={12} padding={20} className="game-complete">
        <CoreRow gap={8} marginBottom={8} className="complete-stars">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`complete-star${i <= stars ? ' complete-star--earned' : ''}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              ★
            </span>
          ))}
        </CoreRow>
        {isNewBest && <div className="complete-new-best">New Best!</div>}
        <CoreText as="h2" className="complete-title">Amazing!</CoreText>
        <CoreText as="p" className="complete-score">
          You got <strong>{score}</strong> out of <strong>{total}</strong>!
        </CoreText>
        <CoreRow gap={16} marginTop={16}>
          <Button variant="primary" onClick={onRestart}>Play Again</Button>
          <Button variant="secondary" onClick={onHome}>Home</Button>
        </CoreRow>
      </CoreCol>
    </>
  )
}

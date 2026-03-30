import './GameComplete.css'

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

export function GameComplete({
  score,
  total,
  stars,
  isNewBest,
  onRestart,
  onHome,
}: GameCompleteProps) {
  return (
    <>
      <Confetti />
      <div className="game-complete">
        <div className="complete-stars">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`complete-star ${i <= stars ? 'complete-star--earned' : ''}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              ★
            </span>
          ))}
        </div>
        {isNewBest && <div className="complete-new-best">New Best!</div>}
        <h2 className="complete-title">Amazing!</h2>
        <p className="complete-score">
          You got <strong>{score}</strong> out of <strong>{total}</strong>!
        </p>
        <div className="complete-actions">
          <Button variant="primary" onClick={onRestart}>
            Play Again
          </Button>
          <Button variant="secondary" onClick={onHome}>
            Home
          </Button>
        </div>
      </div>
    </>
  )
}

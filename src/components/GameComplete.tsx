import './GameComplete.css'

import { Confetti } from './Confetti'
import { Button } from './ui/Button'

interface GameCompleteProps {
  score: number
  total: number
  onRestart: () => void
  onHome: () => void
}

export function GameComplete({ score, total, onRestart, onHome }: GameCompleteProps) {
  return (
    <>
      <Confetti />
      <div className="game-complete">
        <div className="complete-emoji">🎉</div>
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

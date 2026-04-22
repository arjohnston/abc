import './MathDisplay.css'

import type { FeedbackState, MathItem } from '@common/types/game'

import { GameBox } from '../GameBox/GameBox'

function CountBox({ count, emoji, dim }: { count: number; emoji: string; dim?: boolean }) {
  return (
    <GameBox className={`math-box ${dim ? 'math-box--dim' : ''}`}>
      <div className="math-objects">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="math-object">
            {emoji}
          </span>
        ))}
      </div>
    </GameBox>
  )
}

interface MathDisplayProps {
  item: MathItem
  feedback: FeedbackState
  animKey: string
}

export function MathDisplay({ item, feedback, animKey }: MathDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'math--correct' : feedback === 'wrong' ? 'math--wrong' : ''

  return (
    <div key={animKey} className={`math-equation ${feedbackClass}`}>
      <div className="math-row">
        <CountBox count={item.leftCount} emoji={item.emoji} />
        <div className="math-operator">{item.operator}</div>
        <CountBox count={item.rightCount} emoji={item.emoji} dim={item.operator === '-'} />
      </div>
      <div className="math-result-row">
        <span className="math-equals">=</span>
        <div className={`math-answer-box ${feedbackClass}`}>
          <span className="math-answer-q">?</span>
        </div>
      </div>
    </div>
  )
}

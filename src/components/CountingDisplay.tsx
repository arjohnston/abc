import './CountingDisplay.css'

import type { CountingItem, FeedbackState } from '../types/game'

interface CountingDisplayProps {
  item: CountingItem
  feedback: FeedbackState
  animKey: string
}

export function CountingDisplay({ item, feedback, animKey }: CountingDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <div key={animKey} className={`counting-display ${feedbackClass}`}>
      <div className="counting-objects">
        {Array.from({ length: item.count }, (_, i) => (
          <span key={i} className="counting-object" style={{ animationDelay: `${i * 0.05}s` }}>
            {item.emoji}
          </span>
        ))}
      </div>
    </div>
  )
}

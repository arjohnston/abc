import './AnimalDisplay.css'

import type { AnimalItem, FeedbackState } from '../types/game'

interface AnimalDisplayProps {
  item: AnimalItem
  feedback: FeedbackState
  animKey: string
}

export function AnimalDisplay({ item, feedback, animKey }: AnimalDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <div key={animKey} className={`animal-display ${feedbackClass}`}>
      <div className="animal-display__emoji">{item.emoji}</div>
    </div>
  )
}

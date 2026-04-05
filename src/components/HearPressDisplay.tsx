import './HearPressDisplay.css'

import type { FeedbackState } from '../types/game'

interface HearPressDisplayProps {
  feedback: FeedbackState
  animKey: string
}

export function HearPressDisplay({ feedback, animKey }: HearPressDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <div key={animKey} className={`hear-press-display ${feedbackClass}`}>
      <span className="hear-press-display__icon">👂</span>
    </div>
  )
}

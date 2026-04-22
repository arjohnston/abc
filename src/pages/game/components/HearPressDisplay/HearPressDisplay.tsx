import './HearPressDisplay.css'

import type { FeedbackState } from '@common/types/game'

import { GameBox } from '../GameBox/GameBox'

interface HearPressDisplayProps {
  feedback: FeedbackState
  animKey: string
}

export function HearPressDisplay({ feedback, animKey }: HearPressDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <GameBox key={animKey} className={`hear-press-display ${feedbackClass}`}>
      <span className="hear-press-display__icon">👂</span>
    </GameBox>
  )
}

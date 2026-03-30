import './LetterDisplay.css'

import type { FeedbackState } from '../types/game'

interface LetterDisplayProps {
  character: string
  feedback: FeedbackState
  animKey: string
}

export function LetterDisplay({ character, feedback, animKey }: LetterDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <div key={animKey} className={`letter-display ${feedbackClass}`}>
      {character}
    </div>
  )
}

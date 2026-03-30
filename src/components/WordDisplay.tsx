import './WordDisplay.css'

import type { FeedbackState } from '../types/game'

interface WordDisplayProps {
  word: string
  feedback: FeedbackState
  animKey: string
}

export function WordDisplay({ word, feedback, animKey }: WordDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <div key={animKey} className={`word-display ${feedbackClass}`}>
      {word}
    </div>
  )
}

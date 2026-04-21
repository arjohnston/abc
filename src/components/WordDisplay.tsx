import './WordDisplay.css'

import type { FeedbackState } from '../types/game'
import { GameBox } from './GameBox'

interface WordDisplayProps {
  word: string
  feedback: FeedbackState
  animKey: string
}

export function WordDisplay({ word, feedback, animKey }: WordDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <GameBox key={animKey} className={`word-display ${feedbackClass}`}>
      {word}
    </GameBox>
  )
}

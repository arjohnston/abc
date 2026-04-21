import './LetterDisplay.css'

import type { FeedbackState } from '../types/game'
import { GameBox } from './GameBox'

interface LetterDisplayProps {
  character: string
  feedback: FeedbackState
  animKey: string
}

export function LetterDisplay({ character, feedback, animKey }: LetterDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <GameBox key={animKey} className={`letter-display ${feedbackClass}`}>
      {character}
    </GameBox>
  )
}

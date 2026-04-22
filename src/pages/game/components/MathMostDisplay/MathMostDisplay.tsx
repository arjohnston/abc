import './MathMostDisplay.css'

import type { FeedbackState, MathMostItem } from '@common/types/game'

import { GameBox } from '../GameBox/GameBox'

function CountBox({
  count,
  emoji,
  feedbackClass,
}: {
  count: number
  emoji: string
  feedbackClass: string
}) {
  return (
    <div className="mmx-wrap">
      <GameBox className={`mmx-box ${feedbackClass}`}>
        <div className="mmx-objects">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className="mmx-object">
              {emoji}
            </span>
          ))}
        </div>
      </GameBox>
      <div className="mmx-key">{count}</div>
    </div>
  )
}

interface MathMostDisplayProps {
  item: MathMostItem
  feedback: FeedbackState
  pressedKey: string | null
  animKey: string
}

export function MathMostDisplay({ item, feedback, pressedKey, animKey }: MathMostDisplayProps) {
  const getClass = (count: number) => {
    const key = String(count)
    if (!feedback) {
      return ''
    }
    if (key === item.answer) {
      return feedback === 'correct' ? 'mmx-box--correct' : ''
    }
    if (key === pressedKey && feedback === 'wrong') {
      return 'mmx-box--wrong'
    }
    return ''
  }

  return (
    <div key={animKey} className="math-most">
      {item.counts.map((count, i) => (
        <CountBox key={i} count={count} emoji={item.emoji} feedbackClass={getClass(count)} />
      ))}
    </div>
  )
}

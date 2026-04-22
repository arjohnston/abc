import './WhichMoreDisplay.css'

import { CoreRow } from '@core'
import type { FeedbackState, WhichMoreItem } from '../types/game'
import { GameBox } from './GameBox'

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
    <div className="wm-box-wrap">
      <GameBox className={`wm-box ${feedbackClass}`}>
        <div className="wm-objects">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className="wm-object">
              {emoji}
            </span>
          ))}
        </div>
      </GameBox>
      <div className="wm-number">{count}</div>
    </div>
  )
}

interface WhichMoreDisplayProps {
  item: WhichMoreItem
  feedback: FeedbackState
  pressedKey: string | null
  animKey: string
}

export function WhichMoreDisplay({ item, feedback, pressedKey, animKey }: WhichMoreDisplayProps) {
  const getClass = (side: string) => {
    if (!feedback) return ''
    if (side === item.answer) return feedback === 'correct' ? 'wm-box--correct' : ''
    if (side === pressedKey && feedback === 'wrong') return 'wm-box--wrong'
    return ''
  }

  return (
    <CoreRow key={animKey} align="flex-start" gap={16}>
      <CountBox count={parseInt(item.left)} emoji={item.emoji} feedbackClass={getClass(item.left)} />
      <div className="which-more__vs">or</div>
      <CountBox count={parseInt(item.right)} emoji={item.emoji} feedbackClass={getClass(item.right)} />
    </CoreRow>
  )
}

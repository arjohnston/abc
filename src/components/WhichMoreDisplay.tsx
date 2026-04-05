import './WhichMoreDisplay.css'

import type { FeedbackState, WhichMoreItem } from '../types/game'

interface WhichMoreDisplayProps {
  item: WhichMoreItem
  feedback: FeedbackState
  pressedKey: string | null
  animKey: string
}

export function WhichMoreDisplay({ item, feedback, pressedKey, animKey }: WhichMoreDisplayProps) {
  const getClass = (side: string) => {
    if (!feedback) return ''
    if (side === item.answer) return feedback === 'correct' ? 'choice--correct' : ''
    if (side === pressedKey && feedback === 'wrong') return 'choice--wrong'
    return ''
  }

  return (
    <div key={animKey} className="which-more">
      <div className={`which-more__choice ${getClass(item.left)}`}>{item.left}</div>
      <div className="which-more__vs">or</div>
      <div className={`which-more__choice ${getClass(item.right)}`}>{item.right}</div>
    </div>
  )
}

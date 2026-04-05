import './WhatNextDisplay.css'

import type { FeedbackState, WhatNextItem } from '../types/game'

interface WhatNextDisplayProps {
  item: WhatNextItem
  feedback: FeedbackState
  animKey: string
}

export function WhatNextDisplay({ item, feedback, animKey }: WhatNextDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <div className="what-next">
      {item.shown.map((char, i) => (
        <div key={i} className="what-next__tile what-next__tile--shown">
          {char}
        </div>
      ))}
      <div className="what-next__arrow">→</div>
      <div
        key={animKey}
        className={`what-next__tile what-next__tile--blank ${feedbackClass}`}
      >
        ?
      </div>
    </div>
  )
}

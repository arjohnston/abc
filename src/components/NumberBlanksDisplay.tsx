import './NumberBlanksDisplay.css'

import type { BuildNumberItem, FeedbackState } from '../types/game'

interface NumberBlanksDisplayProps {
  item: BuildNumberItem
  filled: string        // digits typed so far, e.g. "1" or "12"
  feedback: FeedbackState
  shakeKey: number
}

export function NumberBlanksDisplay({ item, filled, feedback, shakeKey }: NumberBlanksDisplayProps) {
  const activeSlot = filled.length

  return (
    <div className="number-blanks">
      <div className="number-blanks__display">{item.display}</div>
      <div className="number-blanks__slots">
        {item.digits.map((_, i) => {
          const isActive = i === activeSlot
          const isFilled = i < filled.length
          const digit = filled[i] ?? ''
          const isWrong = feedback === 'wrong' && isActive

          return (
            <div
              key={isWrong ? `slot-${i}-${shakeKey}` : `slot-${i}`}
              className={[
                'number-blanks__slot',
                isFilled ? 'number-blanks__slot--filled' : '',
                isActive ? 'number-blanks__slot--active' : '',
                isWrong ? 'number-blanks__slot--wrong' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {digit}
            </div>
          )
        })}
      </div>
    </div>
  )
}

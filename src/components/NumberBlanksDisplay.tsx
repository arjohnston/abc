import './NumberBlanksDisplay.css'

import { CoreCol } from './core'
import type { FeedbackState } from '../types/game'

interface NumberBlanksDisplayProps {
  display: string
  label?: string
  slots: string[]
  filled: string
  feedback: FeedbackState
  shakeKey: number
}

export function NumberBlanksDisplay({ display, label, slots, filled, feedback, shakeKey }: NumberBlanksDisplayProps) {
  const activeSlot = filled.length

  return (
    <CoreCol align="center" gap={24} className="number-blanks">
      <div className="number-blanks__display">{display}</div>
      {label && <div className="number-blanks__label">{label}</div>}
      <div className="number-blanks__slots">
        {slots.map((_, i) => {
          const isActive = i === activeSlot
          const isFilled = i < filled.length
          const char = filled[i] ?? ''
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
              {char}
            </div>
          )
        })}
      </div>
    </CoreCol>
  )
}

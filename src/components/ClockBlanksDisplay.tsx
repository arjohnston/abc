import './ClockBlanksDisplay.css'

import type { ClockItem, FeedbackState } from '../types/game'

interface ClockBlanksDisplayProps {
  item: ClockItem
  filled: string       // digits typed so far
  feedback: FeedbackState
  shakeKey: number
}

export function ClockBlanksDisplay({ item, filled, feedback, shakeKey }: ClockBlanksDisplayProps) {
  const activeSlot = filled.length

  const renderSlot = (i: number) => {
    const isActive = i === activeSlot
    const isFilled = i < filled.length
    const char = filled[i] ?? ''
    const isWrong = feedback === 'wrong' && isActive

    return (
      <div
        key={isWrong ? `slot-${i}-${shakeKey}` : `slot-${i}`}
        className={[
          'clock-blanks__slot',
          isFilled ? 'clock-blanks__slot--filled' : '',
          isActive ? 'clock-blanks__slot--active' : '',
          isWrong ? 'clock-blanks__slot--wrong' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {char}
      </div>
    )
  }

  const hourSlots = Array.from({ length: item.hourDigitCount }, (_, i) => renderSlot(i))
  const minuteSlots = Array.from({ length: 2 }, (_, i) => renderSlot(item.hourDigitCount + i))

  return (
    <div className="clock-blanks">
      <div className="clock-blanks__emoji">{item.emoji}</div>
      <div className="clock-blanks__digital">{item.display}</div>
      <div className="clock-blanks__slots">
        {hourSlots}
        <span className="clock-blanks__colon">:</span>
        {minuteSlots}
      </div>
    </div>
  )
}

import './ClockBlanksDisplay.css'

import type { ClockItem, FeedbackState } from '@common/types/game'
import { CoreBox, CoreCol, CoreText } from '@core'

interface ClockBlanksDisplayProps {
  item: ClockItem
  filled: string
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
    <CoreCol align="center" gap={20}>
      <div className="clock-blanks__emoji">{item.emoji}</div>
      <div className="clock-blanks__digital">{item.display}</div>
      <div className="clock-blanks__slots">
        {hourSlots}
        <CoreBox marginBottom={4}>
          <CoreText size="sm" className="clock-blanks__colon">
            :
          </CoreText>
        </CoreBox>
        {minuteSlots}
      </div>
    </CoreCol>
  )
}

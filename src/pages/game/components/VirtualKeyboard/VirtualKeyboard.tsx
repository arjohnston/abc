import './VirtualKeyboard.css'

import { CoreButton } from '@core'

interface VirtualKeyboardProps {
  layout: 'letters' | 'numbers'
  onKeyPress: (key: string) => void
  disabled: boolean
}

const LETTER_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

const NUMBER_ROWS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['0']]

export function VirtualKeyboard({ layout, onKeyPress, disabled }: VirtualKeyboardProps) {
  const rows = layout === 'letters' ? LETTER_ROWS : NUMBER_ROWS

  return (
    <div className={`vkb ${layout === 'numbers' ? 'vkb--numbers' : ''}`}>
      {rows.map((row, ri) => (
        <div key={ri} className="vkb__row">
          {row.map((key) => (
            <CoreButton
              key={key}
              className="vkb__key"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => {
                if (!disabled) {
                  onKeyPress(key)
                }
              }}
              disabled={disabled}
            >
              {key}
            </CoreButton>
          ))}
        </div>
      ))}
    </div>
  )
}

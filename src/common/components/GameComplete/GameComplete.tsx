import './GameComplete.css'

import { Confetti } from '@common/components/Confetti/Confetti'
import { CoreBox, CoreButton, CoreCol, CoreRow, CoreText, Spacing } from '@core'

interface GameCompleteProps {
  score: number
  total: number
  stars: number
  isNewBest: boolean
  onRestart: () => void
  onHome: () => void
}

export function GameComplete({
  score,
  total,
  stars,
  isNewBest,
  onRestart,
  onHome,
}: GameCompleteProps) {
  return (
    <>
      <Confetti />
      <CoreCol
        flex={1}
        align="center"
        justify="center"
        gap={Spacing.sm}
        padding={20}
        className="game-complete"
      >
        <CoreRow gap={Spacing.xs} marginBottom={Spacing.xs}>
          {[1, 2, 3].map((i) => (
            <CoreText
              key={i}
              size="sm"
              className={`complete-star${i <= stars ? ' complete-star--earned' : ''}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              ★
            </CoreText>
          ))}
        </CoreRow>
        {isNewBest && (
          <CoreBox className="complete-new-best">
            <CoreText size="sm" color="yellow" style={{ fontSize: '18px', fontWeight: 800 }}>
              New Best!
            </CoreText>
          </CoreBox>
        )}
        <CoreText size="h1" color="game">
          Amazing!
        </CoreText>
        <CoreText size="h3" color="muted">
          You got <strong style={{ color: 'var(--text)' }}>{score}</strong> out of{' '}
          <strong style={{ color: 'var(--text)' }}>{total}</strong>!
        </CoreText>
        <CoreRow gap={Spacing.md} marginTop={Spacing.md}>
          <CoreButton variant="primary" onClick={onRestart}>
            Play Again
          </CoreButton>
          <CoreButton variant="secondary" onClick={onHome}>
            Home
          </CoreButton>
        </CoreRow>
      </CoreCol>
    </>
  )
}

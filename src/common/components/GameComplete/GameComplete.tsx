import './GameComplete.css'

import { Confetti } from '@common/components/Confetti/Confetti'
import { CoreButton, CoreCol, CoreRow, CoreText, Spacing } from '@core'

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
            <span
              key={i}
              className={`complete-star${i <= stars ? ' complete-star--earned' : ''}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              ★
            </span>
          ))}
        </CoreRow>
        {isNewBest && <div className="complete-new-best">New Best!</div>}
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

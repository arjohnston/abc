import './SectionBanner.css'

import { CoreRow, CoreText } from '@core'

import type { Section } from '../../types/game'

interface SectionBannerProps {
  section: Section
  earnedStars: number
  totalPossibleStars: number
  locked: boolean
}

export function SectionBanner({
  section,
  earnedStars,
  totalPossibleStars,
  locked,
}: SectionBannerProps) {
  return (
    <CoreRow
      wrap
      align="center"
      justify="center"
      className={`section-banner ${locked ? 'section-banner--locked' : ''}`}
    >
      <span className="section-banner__emoji">{section.emoji}</span>
      <CoreText size="h2" className="section-banner__title">{section.title}</CoreText>
      <span className="section-banner__stars">
        ⭐ {earnedStars}/{totalPossibleStars}
      </span>
      {locked && (
        <span className="section-banner__lock">
          🔒 Need {section.starsToUnlock - earnedStars} more ⭐
        </span>
      )}
    </CoreRow>
  )
}

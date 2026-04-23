import './SectionBanner.css'

import type { Section } from '@common/types/game'
import { CoreBox, CoreRow, CoreText } from '@core'

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
      <CoreText size="sm" className="section-banner__emoji">
        {section.emoji}
      </CoreText>
      <CoreText size="h2">{section.title}</CoreText>
      <CoreBox className="section-banner__stars">
        <CoreText size="sm" color="muted" style={{ fontSize: '15px', fontWeight: 700 }}>
          ⭐ {earnedStars}/{totalPossibleStars}
        </CoreText>
      </CoreBox>
      {locked && (
        <CoreBox width="100%" marginTop={2}>
          <CoreText
            size="sm"
            color="muted"
            align="center"
            style={{ fontSize: '14px', fontWeight: 700 }}
          >
            🔒 Need {section.starsToUnlock - earnedStars} more ⭐
          </CoreText>
        </CoreBox>
      )}
    </CoreRow>
  )
}

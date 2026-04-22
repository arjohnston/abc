import { describe, expect, it } from 'vitest'

import { generateSubtractionItems } from '../mathSub'

describe('generateSubtractionItems', () => {
  it('returns exactly 10 items', () => {
    expect(generateSubtractionItems(false)).toHaveLength(10)
  })

  it('all items have operator "-"', () => {
    for (const item of generateSubtractionItems(false)) {
      expect(item.operator).toBe('-')
    }
  })

  it('answers are correct differences', () => {
    for (const item of generateSubtractionItems(false)) {
      expect(Number(item.answer)).toBe(item.leftCount - item.rightCount)
    }
  })

  it('answers are always positive (left > right)', () => {
    for (const item of generateSubtractionItems(false)) {
      expect(item.leftCount).toBeGreaterThan(item.rightCount)
    }
  })

  it('leftCount is between 2 and 8', () => {
    for (const item of generateSubtractionItems(false)) {
      expect(item.leftCount).toBeGreaterThanOrEqual(2)
      expect(item.leftCount).toBeLessThanOrEqual(8)
    }
  })
})

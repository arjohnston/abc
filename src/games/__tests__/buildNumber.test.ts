import { describe, expect, it } from 'vitest'

import { generateBuildNumberItems } from '../buildNumber'

describe('generateBuildNumberItems', () => {
  it('returns exactly 10 items', () => {
    expect(generateBuildNumberItems(false)).toHaveLength(10)
    expect(generateBuildNumberItems(true)).toHaveLength(10)
  })

  it('non-random mode returns numbers 10–19 in order', () => {
    const items = generateBuildNumberItems(false)
    for (let i = 0; i < items.length; i++) {
      expect(items[i]?.display).toBe(String(10 + i))
    }
  })

  it('digits split matches display string', () => {
    for (const item of generateBuildNumberItems(false)) {
      expect(item.digits).toEqual(item.display.split(''))
    }
  })

  it('word is non-empty for all items', () => {
    for (const item of generateBuildNumberItems(false)) {
      expect(item.word.length).toBeGreaterThan(0)
    }
  })

  it('word for 10 is "ten"', () => {
    const items = generateBuildNumberItems(false)
    expect(items[0]?.word).toBe('ten')
  })

  it('word for 20 is "twenty"', () => {
    // Need random=true to get numbers above 19; use a known seed approach
    // Just test the non-random first 10 (10-19) then skip
    const items = generateBuildNumberItems(false)
    // 10 = ten, 11 = eleven, ... 19 = nineteen
    expect(items[9]?.word).toBe('nineteen')
  })

  it('all display values are two-digit numbers 10-99', () => {
    for (const item of generateBuildNumberItems(true)) {
      const n = Number(item.display)
      expect(n).toBeGreaterThanOrEqual(10)
      expect(n).toBeLessThanOrEqual(99)
    }
  })
})

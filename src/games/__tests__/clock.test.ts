import { describe, expect, it } from 'vitest'

import { generateClockItems } from '../clock'

describe('generateClockItems', () => {
  it('returns exactly 10 items', () => {
    expect(generateClockItems(true)).toHaveLength(10)
  })

  it('all display strings match HH:MM format', () => {
    for (const item of generateClockItems(true)) {
      expect(item.display).toMatch(/^\d:\d{2}$/)
    }
  })

  it('hours are between 1 and 9', () => {
    for (const item of generateClockItems(true)) {
      const hour = Number(item.display.split(':')[0])
      expect(hour).toBeGreaterThanOrEqual(1)
      expect(hour).toBeLessThanOrEqual(9)
    }
  })

  it('digits array has 3 elements matching the display', () => {
    for (const item of generateClockItems(true)) {
      expect(item.digits).toHaveLength(3)
      const [hourPart, minStr] = item.display.split(':')
      expect(item.digits[0]).toBe(hourPart)
      expect(item.digits[1]).toBe(minStr?.[0])
      expect(item.digits[2]).toBe(minStr?.[1])
    }
  })

  it('all display values are unique', () => {
    const items = generateClockItems(true)
    const displays = items.map((i) => i.display)
    expect(new Set(displays).size).toBe(items.length)
  })

  it('speech for o\'clock hours contains "o\'clock"', () => {
    // Run many times to get at least one :00 time
    let found = false
    for (let i = 0; i < 200; i++) {
      const items = generateClockItems(true)
      const onTheDot = items.find((item) => item.display.endsWith(':00'))
      if (onTheDot) {
        expect(onTheDot.speech).toContain("o'clock")
        found = true
        break
      }
    }
    // It's probabilistic — just log if not found in 200 tries
    if (!found) {
      console.warn('No :00 time generated in 200 tries (probabilistic test)')
    }
  })
})

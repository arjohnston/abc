import { describe, expect, it } from 'vitest'

import { generateWhichMoreItems } from './whichMore'

describe('generateWhichMoreItems', () => {
  it('returns exactly 10 items', () => {
    expect(generateWhichMoreItems(false)).toHaveLength(10)
  })

  it('answer is always the larger of the two numbers', () => {
    for (const item of generateWhichMoreItems(false)) {
      const left = Number(item.left)
      const right = Number(item.right)
      expect(Number(item.answer)).toBe(Math.max(left, right))
    }
  })

  it('left and right are always different', () => {
    for (const item of generateWhichMoreItems(false)) {
      expect(item.left).not.toBe(item.right)
    }
  })

  it('values are between 1 and 6', () => {
    for (const item of generateWhichMoreItems(false)) {
      expect(Number(item.left)).toBeGreaterThanOrEqual(1)
      expect(Number(item.left)).toBeLessThanOrEqual(6)
      expect(Number(item.right)).toBeGreaterThanOrEqual(1)
      expect(Number(item.right)).toBeLessThanOrEqual(6)
    }
  })

  it('each item has a non-empty emoji', () => {
    for (const item of generateWhichMoreItems(false)) {
      expect(item.emoji.length).toBeGreaterThan(0)
    }
  })
})

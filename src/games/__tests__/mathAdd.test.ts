import { describe, expect, it } from 'vitest'

import { generateAdditionItems } from '../mathAdd'

describe('generateAdditionItems', () => {
  it('returns exactly 10 items', () => {
    expect(generateAdditionItems(false)).toHaveLength(10)
    expect(generateAdditionItems(true)).toHaveLength(10)
  })

  it('all items have operator "+"', () => {
    for (const item of generateAdditionItems(false)) {
      expect(item.operator).toBe('+')
    }
  })

  it('answers are correct sums', () => {
    for (const item of generateAdditionItems(false)) {
      expect(Number(item.answer)).toBe(item.leftCount + item.rightCount)
    }
  })

  it('all sums are ≤ 9', () => {
    for (const item of generateAdditionItems(false)) {
      expect(item.leftCount + item.rightCount).toBeLessThanOrEqual(9)
    }
  })

  it('counts are between 1 and 5', () => {
    for (const item of generateAdditionItems(false)) {
      expect(item.leftCount).toBeGreaterThanOrEqual(1)
      expect(item.leftCount).toBeLessThanOrEqual(5)
      expect(item.rightCount).toBeGreaterThanOrEqual(1)
      expect(item.rightCount).toBeLessThanOrEqual(5)
    }
  })

  it('all items share the same emoji', () => {
    const items = generateAdditionItems(false)
    const emoji = items[0]?.emoji
    expect(emoji).toBeTruthy()
    for (const item of items) {
      expect(item.emoji).toBe(emoji)
    }
  })

  it('non-random mode produces consistent pairs (no duplicates)', () => {
    const items = generateAdditionItems(false)
    const pairs = items.map((i) => `${i.leftCount}+${i.rightCount}`)
    const unique = new Set(pairs)
    expect(unique.size).toBe(items.length)
  })
})

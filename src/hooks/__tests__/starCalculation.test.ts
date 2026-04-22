import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useProgress } from '../useProgress'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

function record(
  hook: ReturnType<typeof useProgress>,
  gameId: string,
  score: number,
  total: number,
  maxStars?: number,
) {
  let out = { stars: 0, isNewBest: false }
  act(() => {
    out = hook.recordResult(gameId, score, total, maxStars)
  })
  return out
}

describe('useProgress — star calculation', () => {
  it('awards 3 stars for a perfect score', () => {
    const { result } = renderHook(() => useProgress())
    expect(record(result.current, 'abc', 10, 10).stars).toBe(3)
  })

  it('awards 2 stars for 80%+ accuracy', () => {
    const { result } = renderHook(() => useProgress())
    expect(record(result.current, 'abc', 8, 10).stars).toBe(2)
  })

  it('awards 1 star for any completion below 80%', () => {
    const { result } = renderHook(() => useProgress())
    expect(record(result.current, 'abc', 5, 10).stars).toBe(1)
  })

  it('respects maxStars cap', () => {
    const { result } = renderHook(() => useProgress())
    expect(record(result.current, 'abc', 10, 10, 2).stars).toBe(2)
  })

  it('isNewBest is true on first completion', () => {
    const { result } = renderHook(() => useProgress())
    expect(record(result.current, 'abc', 10, 10).isNewBest).toBe(true)
  })

  it('isNewBest is false when score does not improve', () => {
    const { result } = renderHook(() => useProgress())
    record(result.current, 'abc', 10, 10)
    expect(record(result.current, 'abc', 10, 10).isNewBest).toBe(false)
  })

  it('isNewBest is true when score improves', () => {
    const { result } = renderHook(() => useProgress())
    record(result.current, 'abc', 5, 10) // 1 star
    expect(record(result.current, 'abc', 10, 10).isNewBest).toBe(true) // 3 stars
  })

  it('getStars returns 0 for unplayed game', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.getStars('unknown-game')).toBe(0)
  })

  it('getStars returns saved best stars', () => {
    const { result } = renderHook(() => useProgress())
    record(result.current, 'abc', 10, 10)
    expect(result.current.getStars('abc')).toBe(3)
  })

  it('getTotalStars sums across games', () => {
    const { result } = renderHook(() => useProgress())
    record(result.current, 'game1', 10, 10) // 3 stars
    record(result.current, 'game2', 8, 10) // 2 stars
    expect(result.current.getTotalStars()).toBe(5)
  })

  it('resetProgress clears all stars', () => {
    const { result } = renderHook(() => useProgress())
    record(result.current, 'abc', 10, 10)
    act(() => {
      result.current.resetProgress()
    })
    expect(result.current.getStars('abc')).toBe(0)
    expect(result.current.getTotalStars()).toBe(0)
  })
})

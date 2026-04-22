import { describe, expect, it } from 'vitest'

import { shuffle } from '../utils'

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    expect(shuffle([1, 2, 3, 4, 5])).toHaveLength(5)
  })

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result.sort()).toEqual([...input].sort())
  })

  it('does not mutate the input array', () => {
    const input = [1, 2, 3]
    const copy = [...input]
    shuffle(input)
    expect(input).toEqual(copy)
  })

  it('handles empty array', () => {
    expect(shuffle([])).toEqual([])
  })

  it('handles single-element array', () => {
    expect(shuffle(['a'])).toEqual(['a'])
  })
})

import { useCallback, useState } from 'react'
import { z } from 'zod'

const STORAGE_KEY = 'abc123-stats'

export interface Stats {
  totalPlays: number
  totalCompletions: number
}

const StatsSchema = z.object({
  totalPlays: z.number().int().min(0).default(0),
  totalCompletions: z.number().int().min(0).default(0),
})

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const result = StatsSchema.safeParse(JSON.parse(raw))
      if (result.success) {
        return result.data
      }
    }
  } catch {
    // Corrupted data — start fresh
  }
  return { totalPlays: 0, totalCompletions: 0 }
}

function saveStats(stats: Stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(loadStats)

  const recordPlay = useCallback(() => {
    setStats((prev) => {
      const next = { ...prev, totalPlays: prev.totalPlays + 1 }
      saveStats(next)
      return next
    })
  }, [])

  const recordCompletion = useCallback(() => {
    setStats((prev) => {
      const next = { ...prev, totalCompletions: prev.totalCompletions + 1 }
      saveStats(next)
      return next
    })
  }, [])

  const resetStats = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setStats({ totalPlays: 0, totalCompletions: 0 })
  }, [])

  return { stats, recordPlay, recordCompletion, resetStats }
}

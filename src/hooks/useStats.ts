import { useState, useCallback } from 'react'

const STORAGE_KEY = 'abc123-stats'

export interface Stats {
  totalPlays: number
  totalCompletions: number
}

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Stats
      return {
        totalPlays: parsed.totalPlays ?? 0,
        totalCompletions: parsed.totalCompletions ?? 0,
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
    setStats(prev => {
      const next = { ...prev, totalPlays: prev.totalPlays + 1 }
      saveStats(next)
      return next
    })
  }, [])

  const recordCompletion = useCallback(() => {
    setStats(prev => {
      const next = { ...prev, totalCompletions: prev.totalCompletions + 1 }
      saveStats(next)
      return next
    })
  }, [])

  return { stats, recordPlay, recordCompletion }
}

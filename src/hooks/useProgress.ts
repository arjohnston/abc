import { useCallback, useState } from 'react'

import type { ProgressData, Section } from '../types/game'

const STORAGE_KEY = 'abc123-progress'

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ProgressData
      return { games: parsed.games ?? {} }
    }
  } catch {
    // Corrupted data — start fresh
  }
  return { games: {} }
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function calculateStars(score: number, total: number): number {
  if (score === total) {
    return 3
  }
  if (score >= total * 0.8) {
    return 2
  }
  return 1
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress)

  const getStars = useCallback(
    (gameId: string): number => {
      return progress.games[gameId]?.bestStars ?? 0
    },
    [progress],
  )

  const getTotalStars = useCallback((): number => {
    return Object.values(progress.games).reduce((sum, g) => sum + g.bestStars, 0)
  }, [progress])

  const isSectionUnlocked = useCallback(
    (section: Section): boolean => {
      return getTotalStars() >= section.starsToUnlock
    },
    [getTotalStars],
  )

  const recordResult = useCallback(
    (gameId: string, score: number, total: number): { stars: number; isNewBest: boolean } => {
      const stars = calculateStars(score, total)
      const prevBest = progress.games[gameId]?.bestStars ?? 0
      const isNewBest = stars > prevBest

      if (isNewBest) {
        setProgress((prev) => {
          const next: ProgressData = {
            games: {
              ...prev.games,
              [gameId]: { bestStars: stars },
            },
          }
          saveProgress(next)
          return next
        })
      }

      return { stars, isNewBest }
    },
    [progress],
  )

  return { getStars, getTotalStars, isSectionUnlocked, recordResult }
}

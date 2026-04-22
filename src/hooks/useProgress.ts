import { useCallback, useState } from 'react'

import { GAMES, SECTIONS } from '../games/config'
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

function calculateStars(score: number, total: number, maxStars: number = 3): number {
  let stars = 1
  if (score === total) {
    stars = 3
  } else if (score >= total * 0.8) {
    stars = 2
  }
  return Math.min(stars, maxStars)
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

  const getStarsForSection = useCallback(
    (sectionId: string): number => {
      const gameIds = GAMES.filter((g) => g.sectionId === sectionId).map((g) => g.id)
      return gameIds.reduce((sum, id) => sum + (progress.games[id]?.bestStars ?? 0), 0)
    },
    [progress],
  )

  const isSectionUnlocked = useCallback(
    (section: Section): boolean => {
      if (section.starsToUnlock === 0) {
        return true
      }
      const sectionIndex = SECTIONS.findIndex((s) => s.id === section.id)
      if (sectionIndex <= 0) {
        return true
      }
      const prevSection = SECTIONS[sectionIndex - 1]
      if (!prevSection) {
        return true
      }
      return getStarsForSection(prevSection.id) >= section.starsToUnlock
    },
    [getStarsForSection],
  )

  const recordResult = useCallback(
    (
      gameId: string,
      score: number,
      total: number,
      maxStars: number = 3,
    ): { stars: number; isNewBest: boolean } => {
      const stars = calculateStars(score, total, maxStars)
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

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProgress({ games: {} })
  }, [])

  return { getStars, getTotalStars, isSectionUnlocked, recordResult, resetProgress }
}

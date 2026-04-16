import { useCallback, useEffect, useRef, useState } from 'react'

import { useSoundEffects } from './useSoundEffects'

interface UseRoundReturn {
  score: number
  round: number
  feedback: 'correct' | 'wrong' | null
  lockedRef: React.MutableRefObject<boolean>
  completionResult: { stars: number; isNewBest: boolean } | null
  advance: (correct: boolean) => void
  restart: () => void
}

/**
 * Manages the standard round state machine shared across all custom game screens:
 * score, round index, feedback flash, lock, completion detection.
 *
 * Call advance(true/false) once per round. The hook handles sound, timing,
 * and the onComplete callback automatically.
 */
export function useRound(
  total: number,
  onComplete: (score: number, total: number, maxStars: number) => { stars: number; isNewBest: boolean },
  maxStars = 3,
): UseRoundReturn {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [completionResult, setCompletionResult] = useState<{ stars: number; isNewBest: boolean } | null>(null)

  // Refs track real values to avoid stale closures in advance()
  const scoreRef = useRef(0)
  const roundRef = useRef(0)
  const lockedRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { playCorrect, playWrong, playComplete } = useSoundEffects()

  const advance = useCallback(
    (correct: boolean) => {
      const newScore = correct ? scoreRef.current + 1 : scoreRef.current
      const newRound = roundRef.current + 1

      setFeedback(correct ? 'correct' : 'wrong')
      if (correct) playCorrect()
      else playWrong()

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        scoreRef.current = newScore
        roundRef.current = newRound
        setFeedback(null)

        if (newRound >= total) {
          setScore(newScore)
          setRound(newRound)
          playComplete()
          setCompletionResult(onComplete(newScore, total, maxStars))
        } else {
          setScore(newScore)
          setRound(newRound)
          lockedRef.current = false
        }
      }, 500)
    },
    [total, maxStars, onComplete, playCorrect, playWrong, playComplete],
  )

  const restart = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    scoreRef.current = 0
    roundRef.current = 0
    lockedRef.current = false
    setScore(0)
    setRound(0)
    setFeedback(null)
    setCompletionResult(null)
  }, [])

  // Clean up on unmount
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  return { score, round, feedback, lockedRef, completionResult, advance, restart }
}

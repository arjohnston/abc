import './GameScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { CountingDisplay } from '../components/CountingDisplay'
import { GameComplete } from '../components/GameComplete'
import { LetterDisplay } from '../components/LetterDisplay'
import { BackButton } from '../components/ui/BackButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ScoreBadge } from '../components/ui/ScoreBadge'
import { StreakBadge } from '../components/ui/StreakBadge'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'
import type { CountingItem, FeedbackState, GameConfig, GameItem } from '../types/game'

const NUMBER_WORDS: Record<string, string> = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j] as T
    arr[j] = temp as T
  }
  return arr
}

function buildSequence(game: GameConfig, isRandom: boolean): GameItem[] {
  if (game.type === 'counting') {
    return game.generateItems(isRandom)
  }
  return isRandom ? shuffle(game.items) : [...game.items]
}

function getExpectedKey(item: GameItem, isCounting: boolean): string {
  if (isCounting) {
    return (item as CountingItem).answer
  }
  return (item as string).toUpperCase()
}

function getAnnouncementText(item: GameItem, isCounting: boolean, gameKey: string): string {
  if (isCounting) {
    const ci = item as CountingItem
    return `${NUMBER_WORDS[ci.answer] ?? ci.answer} ${ci.name}`
  }
  if (gameKey === 'numbers') {
    return NUMBER_WORDS[item as string] ?? (item as string)
  }
  return item as string
}

interface GameScreenProps {
  game: GameConfig
  gameKey: string
  isRandom: boolean
  onBack: () => void
  onComplete: () => void
}

export function GameScreen({ game, gameKey, isRandom, onBack, onComplete }: GameScreenProps) {
  const [sequence, setSequence] = useState<GameItem[]>(() => buildSequence(game, isRandom))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  const speak = useSpeech()
  const { playCorrect, playWrong, playComplete } = useSoundEffects()

  const isCounting = game.type === 'counting'
  const currentItem = sequence[currentIndex]

  // Announce the current item when it changes
  useEffect(() => {
    if (currentItem && !isComplete) {
      speak(getAnnouncementText(currentItem, isCounting, gameKey))
    }
  }, [currentIndex, currentItem, isCounting, gameKey, speak, isComplete])

  // Play celebration sound on completion
  useEffect(() => {
    if (isComplete) {
      playComplete()
      onComplete()
    }
  }, [isComplete, onComplete, playComplete])

  const advance = useCallback(() => {
    if (currentIndex + 1 >= sequence.length) {
      setIsComplete(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, sequence.length])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isComplete || !currentItem || feedback) {
        return
      }
      if (e.key.length !== 1) {
        return
      }

      const pressed = e.key.toUpperCase()
      const expected = getExpectedKey(currentItem, isCounting)

      if (pressed === expected) {
        playCorrect()
        setScore((prev) => prev + 1)
        setStreak((prev) => prev + 1)
        setFeedback('correct')
        feedbackTimeout.current = setTimeout(() => {
          setFeedback(null)
          advance()
        }, 400)
      } else {
        playWrong()
        setStreak(0)
        setFeedback('wrong')
        setShakeKey((prev) => prev + 1)
        feedbackTimeout.current = setTimeout(() => {
          setFeedback(null)
        }, 500)
      }
    },
    [currentItem, isComplete, advance, isCounting, feedback, playCorrect, playWrong],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current)
      }
    }
  }, [])

  const progress =
    sequence.length > 0 ? ((currentIndex + (isComplete ? 1 : 0)) / sequence.length) * 100 : 0

  const handleRestart = () => {
    setSequence(buildSequence(game, isRandom))
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setFeedback(null)
    setIsComplete(false)
  }

  const getHintText = () => {
    if (isCounting) {
      return `Round ${currentIndex + 1} of ${sequence.length}`
    }
    if (gameKey === 'abc') {
      return `Letter ${currentIndex + 1} of ${sequence.length}`
    }
    return `Number ${currentIndex + 1} of ${sequence.length}`
  }

  const animKey = `${currentIndex}-${shakeKey}`

  return (
    <div
      className="game"
      style={
        { '--game-color': game.color, '--game-color-dark': game.colorDark } as React.CSSProperties
      }
    >
      <div className="game-topbar">
        <BackButton onClick={onBack} />
        <ProgressBar percent={progress} />
        <ScoreBadge score={score} />
      </div>

      {!isComplete && <StreakBadge streak={streak} />}

      {isComplete ? (
        <GameComplete
          score={score}
          total={sequence.length}
          onRestart={handleRestart}
          onHome={onBack}
        />
      ) : currentItem ? (
        <div className="game-area">
          <p className="game-prompt">{isCounting ? 'How many do you see?' : 'Press this key!'}</p>
          {isCounting ? (
            <CountingDisplay
              item={currentItem as CountingItem}
              feedback={feedback}
              animKey={animKey}
            />
          ) : (
            <LetterDisplay
              character={currentItem as string}
              feedback={feedback}
              animKey={animKey}
            />
          )}
          <p className="game-hint">{getHintText()}</p>
        </div>
      ) : null}
    </div>
  )
}

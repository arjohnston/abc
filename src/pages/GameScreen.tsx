import './GameScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { CountingDisplay } from '../components/CountingDisplay'
import { GameComplete } from '../components/GameComplete'
import { LetterDisplay } from '../components/LetterDisplay'
import { TimerBar } from '../components/TimerBar'
import { BackButton } from '../components/ui/BackButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ScoreBadge } from '../components/ui/ScoreBadge'
import { StreakBadge } from '../components/ui/StreakBadge'
import { WordDisplay } from '../components/WordDisplay'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'
import type {
  CountingItem,
  FeedbackState,
  GameConfig,
  GameItem,
  NumberWordItem,
  TimedGameConfig,
} from '../types/game'

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
  '10': 'ten',
  '11': 'eleven',
  '12': 'twelve',
  '13': 'thirteen',
  '14': 'fourteen',
  '15': 'fifteen',
  '16': 'sixteen',
  '17': 'seventeen',
  '18': 'eighteen',
  '19': 'nineteen',
  '20': 'twenty',
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
  if (game.type === 'numberWords') {
    return game.generateItems(isRandom)
  }
  if (game.type === 'timed') {
    return isRandom ? shuffle(game.items) : [...game.items]
  }
  return isRandom ? shuffle(game.items) : [...game.items]
}

function getExpectedKey(item: GameItem, gameType: string | undefined): string {
  if (gameType === 'counting') {
    return (item as CountingItem).answer
  }
  if (gameType === 'numberWords') {
    return (item as NumberWordItem).answer
  }
  return (item as string).toUpperCase()
}

function getHintSpeech(item: GameItem, gameType: string | undefined, gameId: string): string {
  if (gameType === 'counting') {
    const ci = item as CountingItem
    return `${NUMBER_WORDS[ci.answer] ?? ci.answer} ${ci.name}`
  }
  if (gameType === 'numberWords') {
    const nw = item as NumberWordItem
    return nw.word
  }
  if (gameId === 'numbers' || gameId === 'mixed') {
    const s = item as string
    if (s >= '0' && s <= '9') {
      return NUMBER_WORDS[s] ?? s
    }
  }
  return (item as string).toLowerCase()
}

interface GameScreenProps {
  game: GameConfig
  isRandom: boolean
  onBack: () => void
  onComplete: (
    score: number,
    total: number,
    maxStars: number,
  ) => { stars: number; isNewBest: boolean }
}

export function GameScreen({ game, isRandom, onBack, onComplete }: GameScreenProps) {
  const [sequence, setSequence] = useState<GameItem[]>(() => buildSequence(game, isRandom))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [completionResult, setCompletionResult] = useState<{
    stars: number
    isNewBest: boolean
  } | null>(null)
  const [digitBuffer, setDigitBuffer] = useState('')
  const [hintUsed, setHintUsed] = useState(false)
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout>>(null)
  const digitTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  const speak = useSpeech()
  const { playCorrect, playWrong, playComplete } = useSoundEffects()

  const gameType = game.type
  const isCounting = gameType === 'counting'
  const isNumberWords = gameType === 'numberWords'
  const isTimed = gameType === 'timed'
  const currentItem = sequence[currentIndex]

  const isMultiDigit = isCounting && currentItem && (currentItem as CountingItem).answer.length > 1

  const handleHint = useCallback(() => {
    if (!currentItem || isComplete || feedback) {
      return
    }
    setHintUsed(true)
    speak(getHintSpeech(currentItem, gameType, game.id))
  }, [currentItem, isComplete, feedback, speak, gameType, game.id])

  const finishGame = useCallback(
    (finalScore: number) => {
      const total = sequence.length
      const maxStars = hintUsed ? 2 : 3
      const result = onComplete(finalScore, total, maxStars)
      setCompletionResult(result)
      setIsComplete(true)
      playComplete()
    },
    [sequence.length, onComplete, playComplete, hintUsed],
  )

  const advance = useCallback(() => {
    if (currentIndex + 1 >= sequence.length) {
      finishGame(score + 1)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setDigitBuffer('')
    }
  }, [currentIndex, sequence.length, finishGame, score])

  const handleCorrect = useCallback(() => {
    playCorrect()
    setScore((prev) => prev + 1)
    setStreak((prev) => prev + 1)
    setFeedback('correct')
    feedbackTimeout.current = setTimeout(() => {
      setFeedback(null)
      advance()
    }, 400)
  }, [playCorrect, advance])

  const handleWrong = useCallback(() => {
    playWrong()
    setStreak(0)
    setFeedback('wrong')
    setShakeKey((prev) => prev + 1)
    setDigitBuffer('')
    feedbackTimeout.current = setTimeout(() => {
      setFeedback(null)
    }, 500)
  }, [playWrong])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isComplete || !currentItem || feedback) {
        return
      }
      if (e.key.length !== 1) {
        return
      }

      const pressed = e.key.toUpperCase()
      const expected = getExpectedKey(currentItem, gameType)

      // Multi-digit input for counting higher
      if (isMultiDigit) {
        if (pressed >= '0' && pressed <= '9') {
          const newBuffer = digitBuffer + pressed
          setDigitBuffer(newBuffer)

          if (digitTimeout.current) {
            clearTimeout(digitTimeout.current)
          }

          if (newBuffer === expected) {
            handleCorrect()
          } else if (newBuffer.length >= expected.length) {
            handleWrong()
          } else {
            // Wait for more digits
            digitTimeout.current = setTimeout(() => {
              if (newBuffer !== expected) {
                handleWrong()
              }
            }, 1500)
          }
        }
        return
      }

      // Single key input
      if (pressed === expected) {
        handleCorrect()
      } else {
        handleWrong()
      }
    },
    [
      currentItem,
      isComplete,
      feedback,
      gameType,
      isMultiDigit,
      digitBuffer,
      handleCorrect,
      handleWrong,
    ],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Timer expired handler for timed games
  const handleTimeUp = useCallback(() => {
    if (!isComplete) {
      finishGame(score)
    }
  }, [isComplete, score, finishGame])

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current)
      }
      if (digitTimeout.current) {
        clearTimeout(digitTimeout.current)
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
    setCompletionResult(null)
    setDigitBuffer('')
    setHintUsed(false)
  }

  const getProgressText = () => {
    if (isCounting) {
      return `Round ${currentIndex + 1} of ${sequence.length}`
    }
    if (isNumberWords) {
      return `Word ${currentIndex + 1} of ${sequence.length}`
    }
    if (game.id === 'abc' || game.id === 'lowercase') {
      return `Letter ${currentIndex + 1} of ${sequence.length}`
    }
    return `${currentIndex + 1} of ${sequence.length}`
  }

  const getPromptText = () => {
    if (isCounting) {
      return 'How many do you see?'
    }
    if (isNumberWords) {
      return 'Press the number!'
    }
    return 'Press this key!'
  }

  const animKey = `${currentIndex}-${shakeKey}`

  const renderDisplay = () => {
    if (!currentItem) {
      return null
    }
    if (isCounting) {
      return (
        <CountingDisplay item={currentItem as CountingItem} feedback={feedback} animKey={animKey} />
      )
    }
    if (isNumberWords) {
      return (
        <WordDisplay
          word={(currentItem as NumberWordItem).word}
          feedback={feedback}
          animKey={animKey}
        />
      )
    }
    return <LetterDisplay character={currentItem as string} feedback={feedback} animKey={animKey} />
  }

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

      {isTimed && !isComplete && (
        <div className="game-timer">
          <TimerBar
            duration={(game as TimedGameConfig).timeLimit}
            running={!isComplete}
            onTimeUp={handleTimeUp}
          />
        </div>
      )}

      {!isComplete && <StreakBadge streak={streak} />}

      {isComplete && completionResult ? (
        <GameComplete
          score={score}
          total={sequence.length}
          stars={completionResult.stars}
          isNewBest={completionResult.isNewBest}
          onRestart={handleRestart}
          onHome={onBack}
        />
      ) : currentItem ? (
        <div className="game-area">
          <p className="game-prompt">{getPromptText()}</p>
          {renderDisplay()}
          {isMultiDigit && digitBuffer && <div className="digit-preview">{digitBuffer}</div>}
          <div className="game-bottom">
            <button className="hint-btn" onClick={handleHint} disabled={!!feedback}>
              💡 Hint{hintUsed ? ' (max ★★)' : ''}
            </button>
            <p className="game-progress">{getProgressText()}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

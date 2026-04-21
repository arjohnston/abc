import './GameScreen.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { AnimalDisplay } from '../components/AnimalDisplay'
import { ClockBlanksDisplay } from '../components/ClockBlanksDisplay'
import { ColorDisplay } from '../components/ColorDisplay'
import { CountingDisplay } from '../components/CountingDisplay'
import { GameComplete } from '../components/GameComplete'
import { HearPressDisplay } from '../components/HearPressDisplay'
import { LetterDisplay } from '../components/LetterDisplay'
import { NumberBlanksDisplay } from '../components/NumberBlanksDisplay'
import { TimerBar } from '../components/TimerBar'
import { GameTopbar } from '../components/ui/GameTopbar'
import { StreakBadge } from '../components/ui/StreakBadge'
import { VirtualKeyboard } from '../components/VirtualKeyboard'
import { MathDisplay } from '../components/MathDisplay'
import { MathMostDisplay } from '../components/MathMostDisplay'
import { WhatNextDisplay } from '../components/WhatNextDisplay'
import { WhichMoreDisplay } from '../components/WhichMoreDisplay'
import { WordDisplay } from '../components/WordDisplay'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useSpeech } from '../hooks/useSpeech'
import type {
  AnimalItem,
  BuildNumberItem,
  BuildWordItem,
  ClockItem,
  ColorItem,
  CountingItem,
  FeedbackState,
  GameConfig,
  GameItem,
  MathItem,
  MathMostItem,
  NumberWordItem,
  TimedGameConfig,
  WhatNextItem,
  WhichMoreItem,
} from '../types/game'

const NUMBER_WORDS: Record<string, string> = {
  '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
  '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
  '10': 'ten', '11': 'eleven', '12': 'twelve', '13': 'thirteen',
  '14': 'fourteen', '15': 'fifteen', '16': 'sixteen', '17': 'seventeen',
  '18': 'eighteen', '19': 'nineteen', '20': 'twenty',
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]; arr[i] = arr[j] as T; arr[j] = temp as T
  }
  return arr
}

function buildSequence(game: GameConfig, isRandom: boolean): GameItem[] {
  if (game.type === 'counting') return game.generateItems(isRandom)
  if (game.type === 'numberWords') return game.generateItems(isRandom)
  if (game.type === 'buildNumber') return game.generateItems(isRandom)
  if (game.type === 'whichMore') return game.generateItems(isRandom)
  if (game.type === 'mathAdd') return game.generateItems(isRandom)
  if (game.type === 'mathSub') return game.generateItems(isRandom)
  if (game.type === 'mathMost') return game.generateItems(isRandom)
  if (game.type === 'whatNext') return game.generateItems(isRandom)
  if (game.type === 'whatBefore') return game.generateItems(isRandom)
  if (game.type === 'animalSounds') return isRandom ? shuffle(game.items) : [...game.items]
  if (game.type === 'buildWord') return isRandom ? shuffle(game.items) : [...game.items]
  if (game.type === 'colorMatch') return isRandom ? shuffle(game.items) : [...game.items]
  if (game.type === 'clock') return game.generateItems(isRandom)
  if (game.type === 'timed') return isRandom ? shuffle(game.items) : [...game.items]
  if (game.type === 'mouseDirection' || game.type === 'chaseBall' || game.type === 'arrowGame' || game.type === 'simonSays') return []
  if (game.type === 'clickLetter') return isRandom ? shuffle(game.items) : [...game.items]
  return isRandom ? shuffle(game.items) : [...game.items]
}

function getExpectedKey(item: GameItem, gameType: string | undefined): string {
  if (gameType === 'counting') return (item as CountingItem).answer
  if (gameType === 'numberWords') return (item as NumberWordItem).answer
  if (gameType === 'animalSounds') return (item as AnimalItem).key
  if (gameType === 'whichMore') return (item as WhichMoreItem).answer
  if (gameType === 'mathAdd' || gameType === 'mathSub') return (item as MathItem).answer
  if (gameType === 'mathMost') return (item as MathMostItem).answer
  if (gameType === 'whatNext' || gameType === 'whatBefore') return (item as WhatNextItem).answer.toUpperCase()
  if (gameType === 'colorMatch') return (item as ColorItem).key
  return (item as string).toUpperCase()
}

function getHintSpeech(
  item: GameItem,
  gameType: string | undefined,
  gameId: string,
  expectLower?: boolean,
  audioOnly?: boolean,
): string {
  if (gameType === 'counting') return (item as CountingItem).answer
  if (gameType === 'numberWords') return (item as NumberWordItem).word
  if (gameType === 'animalSounds') return (item as AnimalItem).name
  if (gameType === 'buildNumber') return (item as BuildNumberItem).word
  if (gameType === 'whichMore') {
    const wm = item as WhichMoreItem
    return NUMBER_WORDS[wm.answer] ?? wm.answer
  }
  if (gameType === 'mathAdd') {
    const m = item as MathItem
    return `${NUMBER_WORDS[String(m.leftCount)] ?? m.leftCount} plus ${NUMBER_WORDS[String(m.rightCount)] ?? m.rightCount} equals?`
  }
  if (gameType === 'mathSub') {
    const m = item as MathItem
    return `${NUMBER_WORDS[String(m.leftCount)] ?? m.leftCount} minus ${NUMBER_WORDS[String(m.rightCount)] ?? m.rightCount} equals?`
  }
  if (gameType === 'mathMost') {
    const mm = item as MathMostItem
    return `Which group has the most? ${mm.counts.map(c => NUMBER_WORDS[String(c)] ?? c).join(', ')}`
  }
  if (gameType === 'whatNext') {
    const wn = item as WhatNextItem
    return `${wn.shown.join(', ')}, what comes next?`
  }
  if (gameType === 'whatBefore') {
    const wn = item as WhatNextItem
    return `${wn.shown.join(', ')}, what comes before?`
  }
  if (gameType === 'colorMatch') return `${(item as ColorItem).name}! Press the first letter`
  if (gameType === 'buildWord') return (item as BuildWordItem).word
  if (gameType === 'clock') return (item as ClockItem).speech
  if (audioOnly || gameId === 'hear-press') {
    const s = item as string
    return NUMBER_WORDS[s] ?? s.toLowerCase()
  }
  if (gameId === 'numbers' || gameId === 'mixed') {
    const s = item as string
    if (s >= '0' && s <= '9') return NUMBER_WORDS[s] ?? s
  }
  const char = (item as string).toLowerCase()
  if (expectLower) return `lowercase ${char}`
  return char
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
  const [completionResult, setCompletionResult] = useState<{ stars: number; isNewBest: boolean } | null>(null)
  const [digitBuffer, setDigitBuffer] = useState('')
  const [buildBuffer, setBuildBuffer] = useState('')
  const [lastPressed, setLastPressed] = useState<string | null>(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [currentItemWrong, setCurrentItemWrong] = useState(false)
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout>>(null)
  const digitTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  const speak = useSpeech()
  const { playCorrect, playWrong, playComplete } = useSoundEffects()

  const gameType = game.type
  const isCounting = gameType === 'counting'
  const isNumberWords = gameType === 'numberWords'
  const isTimed = gameType === 'timed'
  const isBuildNumber = gameType === 'buildNumber'
  const isBuildWord = gameType === 'buildWord'
  const isClock = gameType === 'clock'
  const isAnimalSounds = gameType === 'animalSounds'
  const isWhichMore = gameType === 'whichMore'
  const isMath = gameType === 'mathAdd' || gameType === 'mathSub'
  const isMathMost = gameType === 'mathMost'
  const isWhatNext = gameType === 'whatNext'
  const isWhatBefore = gameType === 'whatBefore'
  const isColorMatch = gameType === 'colorMatch'
  const expectLower = game.type === undefined ? (game as { expectLower?: boolean }).expectLower : false
  const audioOnly = game.type === undefined ? (game as { audioOnly?: boolean }).audioOnly : false
  const currentItem = sequence[currentIndex]

  const isMultiDigit = isCounting && currentItem && (currentItem as CountingItem).answer.length > 1

  const alwaysSpeak = isAnimalSounds || isBuildNumber || isBuildWord || isWhatNext || isWhatBefore || audioOnly || isColorMatch || isClock || isMath || isMathMost

  const handleHint = useCallback(() => {
    if (!currentItem || isComplete || feedback) return
    if (!alwaysSpeak) setHintUsed(true)
    speak(getHintSpeech(currentItem, gameType, game.id, expectLower, audioOnly))
  }, [currentItem, isComplete, feedback, speak, gameType, game.id, expectLower, audioOnly])

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

  const advance = useCallback(
    (scored: boolean) => {
      if (currentIndex + 1 >= sequence.length) {
        finishGame(scored ? score + 1 : score)
      } else {
        setCurrentIndex((prev) => prev + 1)
        setDigitBuffer('')
        setBuildBuffer('')
        setLastPressed(null)
        setCurrentItemWrong(false)
      }
    },
    [currentIndex, sequence.length, finishGame, score],
  )

  const handleCorrect = useCallback(() => {
    playCorrect()
    const scored = !currentItemWrong
    if (scored) setScore((prev) => prev + 1)
    setStreak((prev) => prev + 1)
    setFeedback('correct')
    feedbackTimeout.current = setTimeout(() => {
      setFeedback(null)
      advance(scored)
    }, 400)
  }, [playCorrect, advance, currentItemWrong])

  const handleWrong = useCallback(() => {
    playWrong()
    setCurrentItemWrong(true)
    setStreak(0)
    setFeedback('wrong')
    setShakeKey((prev) => prev + 1)
    setDigitBuffer('')
    feedbackTimeout.current = setTimeout(() => {
      setFeedback(null)
    }, 500)
  }, [playWrong])

  const handleInput = useCallback(
    (key: string) => {
      if (isComplete || !currentItem || feedback) return
      const pressed = key.toUpperCase()

      // Build-a-number: slot-by-slot digit input
      if (isBuildNumber) {
        if (pressed >= '0' && pressed <= '9') {
          const item = currentItem as BuildNumberItem
          const expectedDigit = item.digits[buildBuffer.length]
          if (pressed === expectedDigit) {
            const newBuffer = buildBuffer + pressed
            setBuildBuffer(newBuffer)
            if (newBuffer.length === item.digits.length) handleCorrect()
          } else {
            handleWrong()
          }
        }
        return
      }

      // Clock: slot-by-slot digit input
      if (isClock) {
        if (pressed >= '0' && pressed <= '9') {
          const item = currentItem as ClockItem
          const expectedDigit = item.digits[buildBuffer.length]
          if (pressed === expectedDigit) {
            const newBuffer = buildBuffer + pressed
            setBuildBuffer(newBuffer)
            if (newBuffer.length === item.digits.length) handleCorrect()
          } else {
            handleWrong()
          }
        }
        return
      }

      // Build-a-word: slot-by-slot letter input
      if (isBuildWord) {
        const item = currentItem as BuildWordItem
        const expectedLetter = item.letters[buildBuffer.length]
        if (pressed === expectedLetter) {
          const newBuffer = buildBuffer + pressed
          setBuildBuffer(newBuffer)
          if (newBuffer.length === item.letters.length) handleCorrect()
        } else {
          handleWrong()
        }
        return
      }

      setLastPressed(pressed)
      const expected = getExpectedKey(currentItem, gameType)

      // Multi-digit input for counting higher
      if (isMultiDigit) {
        if (pressed >= '0' && pressed <= '9') {
          const newBuffer = digitBuffer + pressed
          setDigitBuffer(newBuffer)
          if (digitTimeout.current) clearTimeout(digitTimeout.current)
          if (newBuffer === expected) {
            handleCorrect()
          } else if (newBuffer.length >= expected.length) {
            handleWrong()
          } else {
            digitTimeout.current = setTimeout(() => handleWrong(), 10000)
          }
        }
        return
      }

      if (pressed === expected) handleCorrect()
      else handleWrong()
    },
    [
      currentItem, isComplete, feedback, gameType,
      isBuildNumber, isBuildWord, isClock, buildBuffer, isMultiDigit, digitBuffer,
      handleCorrect, handleWrong,
    ],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key.length === 1) handleInput(e.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleInput])

  // Auto-speak on item change
  useEffect(() => {
    if (!currentItem || isComplete) return
    if (game.autoSpeak || alwaysSpeak) {
      speak(getHintSpeech(currentItem, gameType, game.id, expectLower, audioOnly))
    }
  }, [currentIndex, isComplete]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTimeUp = useCallback(() => {
    if (!isComplete) finishGame(score)
  }, [isComplete, score, finishGame])

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
      if (digitTimeout.current) clearTimeout(digitTimeout.current)
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
    setBuildBuffer('')
    setLastPressed(null)
    setHintUsed(false)
    setCurrentItemWrong(false)
  }

  const getProgressText = () => {
    if (isCounting) return `Round ${currentIndex + 1} of ${sequence.length}`
    if (isNumberWords || isWhichMore || isMath || isMathMost) return `${currentIndex + 1} of ${sequence.length}`
    if (isBuildNumber) return `Number ${currentIndex + 1} of ${sequence.length}`
    if (isBuildWord) return `Word ${currentIndex + 1} of ${sequence.length}`
    if (isClock) return `Clock ${currentIndex + 1} of ${sequence.length}`
    if (isAnimalSounds) return `Animal ${currentIndex + 1} of ${sequence.length}`
    if (isColorMatch) return `Color ${currentIndex + 1} of ${sequence.length}`
    if (isWhatNext) return `${currentIndex + 1} of ${sequence.length}`
    if (game.id === 'abc' || game.id === 'lowercase') return `Letter ${currentIndex + 1} of ${sequence.length}`
    return `${currentIndex + 1} of ${sequence.length}`
  }

  const getPromptText = () => {
    if (isCounting) return 'How many do you see?'
    if (isNumberWords) return 'Press the number!'
    if (isBuildNumber) return 'Type each digit!'
    if (isBuildWord) return 'Spell the word!'
    if (isClock) return 'Type the time!'
    if (isAnimalSounds) return 'Press the first letter!'
    if (isColorMatch) return 'Press the first letter!'
    if (isWhichMore) return 'Press the bigger number!'
    if (isMath) return 'Type the answer!'
    if (isMathMost) return 'Press the biggest group!'
    if (isWhatNext) return 'What comes next?'
    if (isWhatBefore) return 'What comes before?'
    if (audioOnly) return 'Press what you hear!'
    if (expectLower) return 'Press the lowercase letter!'
    return 'Press this key!'
  }

  const animKey = `${currentIndex}-${shakeKey}`

  const needsLetters =
    game.id === 'abc' || game.id === 'lowercase' || game.id === 'mixed' ||
    game.id === 'letter-pairs' || isAnimalSounds || isWhatNext || isWhatBefore || isBuildWord || isColorMatch
  const kbLayout: 'letters' | 'numbers' = needsLetters ? 'letters' : 'numbers'

  const renderDisplay = () => {
    if (!currentItem) return null
    if (isCounting) return <CountingDisplay item={currentItem as CountingItem} feedback={feedback} animKey={animKey} />
    if (isNumberWords) return <WordDisplay word={(currentItem as NumberWordItem).word} feedback={feedback} animKey={animKey} />
    if (isAnimalSounds) return <AnimalDisplay item={currentItem as AnimalItem} feedback={feedback} animKey={animKey} />
    if (isBuildNumber) {
      const bn = currentItem as BuildNumberItem
      return <NumberBlanksDisplay display={bn.display} slots={bn.digits} filled={buildBuffer} feedback={feedback} shakeKey={shakeKey} />
    }
    if (isBuildWord) {
      const bw = currentItem as BuildWordItem
      return <NumberBlanksDisplay display={bw.emoji} label={bw.word.toUpperCase()} slots={bw.letters} filled={buildBuffer} feedback={feedback} shakeKey={shakeKey} />
    }
    if (isColorMatch) return <ColorDisplay item={currentItem as ColorItem} feedback={feedback} animKey={animKey} />
    if (isClock) return <ClockBlanksDisplay item={currentItem as ClockItem} filled={buildBuffer} feedback={feedback} shakeKey={shakeKey} />
    if (isWhichMore) return <WhichMoreDisplay item={currentItem as WhichMoreItem} feedback={feedback} pressedKey={lastPressed} animKey={animKey} />
    if (isMath) return <MathDisplay item={currentItem as MathItem} feedback={feedback} animKey={animKey} />
    if (isMathMost) return <MathMostDisplay item={currentItem as MathMostItem} feedback={feedback} pressedKey={lastPressed} animKey={animKey} />
    if (isWhatNext) return <WhatNextDisplay item={currentItem as WhatNextItem} feedback={feedback} animKey={animKey} />
    if (isWhatBefore) return <WhatNextDisplay item={currentItem as WhatNextItem} feedback={feedback} animKey={animKey} reversed />
    if (audioOnly) return <HearPressDisplay feedback={feedback} animKey={animKey} />
    return <LetterDisplay character={currentItem as string} feedback={feedback} animKey={animKey} />
  }

  return (
    <div
      className="game"
      style={{ '--game-color': game.color, '--game-color-dark': game.colorDark } as React.CSSProperties}
    >
      <GameTopbar onBack={onBack} percent={progress} score={score} />

      {isTimed && !isComplete && (
        <div className="game-timer">
          <TimerBar duration={(game as TimedGameConfig).timeLimit} running={!isComplete} onTimeUp={handleTimeUp} />
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
            <button
              className="hint-btn"
              onPointerDown={(e) => { e.preventDefault(); handleHint() }}
              disabled={!!feedback}
            >
              💡 Hint{hintUsed ? ' (max ★★)' : ''}
            </button>
            <p className="game-progress">{getProgressText()}</p>
          </div>
          <VirtualKeyboard layout={kbLayout} onKeyPress={handleInput} disabled={!!feedback || isComplete} />
        </div>
      ) : null}
    </div>
  )
}

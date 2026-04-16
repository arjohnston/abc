import { useCallback, useState } from 'react'

import { useProgress } from './hooks/useProgress'
import { useStats } from './hooks/useStats'
import { ChaseBallScreen } from './pages/ChaseBallScreen'
import { ClickCircleScreen } from './pages/ClickCircleScreen'
import { FollowArrowScreen } from './pages/FollowArrowScreen'
import { SimonSaysScreen } from './pages/SimonSaysScreen'
import { ClickLetterScreen } from './pages/ClickLetterScreen'
import { DinoGameScreen } from './pages/DinoGameScreen'
import { GameScreen } from './pages/GameScreen'
import { HomeScreen } from './pages/HomeScreen'
import { MiniGameScreen } from './pages/MiniGameScreen'
import { MouseDirectionScreen } from './pages/MouseDirectionScreen'
import { TicTacToeScreen } from './pages/TicTacToeScreen'
import type { GameConfig } from './types/game'

function App() {
  const [currentGame, setCurrentGame] = useState<GameConfig | null>(null)
  const [miniGameIndex, setMiniGameIndex] = useState<number | null>(null)
  const [isRandom, setIsRandom] = useState(true)
  const { stats, recordPlay, resetStats } = useStats()
  const { getStars, getTotalStars, isSectionUnlocked, recordResult, resetProgress } = useProgress()

  const handleReset = useCallback(() => {
    resetProgress()
    resetStats()
  }, [resetProgress, resetStats])

  const handleSelectGame = useCallback(
    (game: GameConfig) => {
      recordPlay()
      setCurrentGame(game)
    },
    [recordPlay],
  )

  const handleComplete = useCallback(
    (score: number, total: number, maxStars: number) => {
      if (!currentGame) {
        return { stars: 1, isNewBest: false }
      }
      return recordResult(currentGame.id, score, total, maxStars)
    },
    [currentGame, recordResult],
  )

  if (currentGame) {
    if (currentGame.type === 'arrowGame') {
      return (
        <FollowArrowScreen
          key={currentGame.id}
          game={currentGame}
          onBack={() => setCurrentGame(null)}
          onComplete={handleComplete}
        />
      )
    }
    if (currentGame.type === 'simonSays') {
      return (
        <SimonSaysScreen
          key={currentGame.id}
          game={currentGame}
          onBack={() => setCurrentGame(null)}
          onComplete={handleComplete}
        />
      )
    }
    if (currentGame.type === 'mouseDirection') {
      return (
        <MouseDirectionScreen
          key={currentGame.id}
          game={currentGame}
          onBack={() => setCurrentGame(null)}
          onComplete={handleComplete}
        />
      )
    }
    if (currentGame.type === 'chaseBall') {
      return (
        <ChaseBallScreen
          key={currentGame.id}
          game={currentGame}
          onBack={() => setCurrentGame(null)}
          onComplete={handleComplete}
        />
      )
    }
    if (currentGame.type === 'clickLetter') {
      return (
        <ClickLetterScreen
          key={currentGame.id}
          game={currentGame}
          onBack={() => setCurrentGame(null)}
          onComplete={handleComplete}
        />
      )
    }
    return (
      <GameScreen
        key={`${currentGame.id}-${isRandom}`}
        game={currentGame}
        isRandom={isRandom}
        onBack={() => setCurrentGame(null)}
        onComplete={handleComplete}
      />
    )
  }

  if (miniGameIndex === 0) {
    return <MiniGameScreen onBack={() => setMiniGameIndex(null)} />
  }

  if (miniGameIndex === 1) {
    return <DinoGameScreen onBack={() => setMiniGameIndex(null)} />
  }

  if (miniGameIndex === 2) {
    return <ClickCircleScreen onBack={() => setMiniGameIndex(null)} />
  }

  if (miniGameIndex === 3) {
    return <TicTacToeScreen onBack={() => setMiniGameIndex(null)} />
  }

  return (
    <HomeScreen
      isRandom={isRandom}
      onToggleRandom={() => setIsRandom(!isRandom)}
      onSelectGame={handleSelectGame}
      onPlayMiniGame={(idx) => setMiniGameIndex(idx)}
      onReset={handleReset}
      stats={stats}
      getStars={getStars}
      getTotalStars={getTotalStars}
      isSectionUnlocked={isSectionUnlocked}
    />
  )
}

export default App

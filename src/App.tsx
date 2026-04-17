import { useCallback, useState } from 'react'

import { useProgress } from './hooks/useProgress'
import { useStats } from './hooks/useStats'
import { ChaseBallScreen } from './pages/ChaseBallScreen'
import { ClickCircleScreen } from './pages/ClickCircleScreen'
import { ClickLetterScreen } from './pages/ClickLetterScreen'
import { DinoGameScreen } from './pages/DinoGameScreen'
import { FollowArrowScreen } from './pages/FollowArrowScreen'
import { GameScreen } from './pages/GameScreen'
import { HomeScreen } from './pages/HomeScreen'
import { MiniGameScreen } from './pages/MiniGameScreen'
import { MouseDirectionScreen } from './pages/MouseDirectionScreen'
import { SimonSaysScreen } from './pages/SimonSaysScreen'
import { TicTacToeScreen } from './pages/TicTacToeScreen'
import type { CustomGameScreenProps, GameConfig } from './types/game'

// Registry: game type → custom screen component.
// Adding a new custom game only requires one entry here + a new screen file.
const CUSTOM_SCREENS: Partial<Record<string, React.ComponentType<CustomGameScreenProps>>> = {
  arrowGame:       FollowArrowScreen as React.ComponentType<CustomGameScreenProps>,
  simonSays:       SimonSaysScreen   as React.ComponentType<CustomGameScreenProps>,
  mouseDirection:  MouseDirectionScreen as React.ComponentType<CustomGameScreenProps>,
  chaseBall:       ChaseBallScreen   as React.ComponentType<CustomGameScreenProps>,
  clickLetter:     ClickLetterScreen as React.ComponentType<CustomGameScreenProps>,
}

// Registry: sectionIndex → standalone screen component (matches MINI_GAMES afterSectionIndex).
const MINI_GAME_SCREENS: Array<React.ComponentType<{ onBack: () => void }> | undefined> = [
  MiniGameScreen,    // 0: after Basics
  DinoGameScreen,    // 1: after Growing
  undefined,         // 2: no mini-game between Next Steps and Mouse Skills
  ClickCircleScreen, // 3: after Mouse Skills
  TicTacToeScreen,   // 4: after Challenge
]

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
      if (!currentGame) return { stars: 1, isNewBest: false }
      return recordResult(currentGame.id, score, total, maxStars)
    },
    [currentGame, recordResult],
  )

  const handleBack = useCallback(() => setCurrentGame(null), [])

  // Route to custom game screen if registered, otherwise use GameScreen
  if (currentGame) {
    const CustomScreen = CUSTOM_SCREENS[currentGame.type ?? '']
    if (CustomScreen) {
      return (
        <CustomScreen
          key={currentGame.id}
          game={currentGame}
          onBack={handleBack}
          onComplete={handleComplete}
        />
      )
    }
    return (
      <GameScreen
        key={`${currentGame.id}-${isRandom}`}
        game={currentGame}
        isRandom={isRandom}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    )
  }

  // Route to mini-game screen by index
  if (miniGameIndex !== null) {
    const MiniScreen = MINI_GAME_SCREENS[miniGameIndex]
    if (MiniScreen) {
      return <MiniScreen onBack={() => setMiniGameIndex(null)} />
    }
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

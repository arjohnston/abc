import { useCallback, useState } from 'react'

import { getGamesForSection } from './games/config'
import { useProgress } from './hooks/useProgress'
import { useStats } from './hooks/useStats'
import { BonusScreen } from './pages/BonusScreen'
import { ChaseBallScreen } from './pages/ChaseBallScreen'
import { ClickCircleScreen } from './pages/ClickCircleScreen'
import { ClickLetterScreen } from './pages/ClickLetterScreen'
import { DinoGameScreen } from './pages/DinoGameScreen'
import { FollowArrowScreen } from './pages/FollowArrowScreen'
import { FroggerScreen } from './pages/FroggerScreen'
import { GameScreen } from './pages/GameScreen'
import { HomeScreen } from './pages/HomeScreen'
import { MiniGameScreen } from './pages/MiniGameScreen'
import { MouseDirectionScreen } from './pages/MouseDirectionScreen'
import { SimonSaysScreen } from './pages/SimonSaysScreen'
import { SpaceMathScreen } from './pages/SpaceMathScreen'
import { TicTacToeScreen } from './pages/TicTacToeScreen'
import type { CustomGameScreenProps, GameConfig, SimonSaysGameConfig } from './types/game'

// Thin wrapper so SimonSaysScreen can live as a standalone bonus game
const SIMON_GAME: SimonSaysGameConfig = {
  id: 'simon-says',
  sectionId: '',
  title: 'Simon Says',
  emoji: '🤖',
  description: '',
  color: 'var(--yellow)',
  colorDark: 'var(--yellow-dark)',
  type: 'simonSays',
  items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
}
function SimonSaysBonusScreen({ onBack }: { onBack: () => void }) {
  return (
    <SimonSaysScreen
      game={SIMON_GAME}
      onBack={onBack}
      onComplete={() => ({ stars: 1, isNewBest: false })}
    />
  )
}

// Registry: game type → custom screen component.
const CUSTOM_SCREENS: Partial<Record<string, React.ComponentType<CustomGameScreenProps>>> = {
  arrowGame: FollowArrowScreen as React.ComponentType<CustomGameScreenProps>,
  mouseDirection: MouseDirectionScreen as React.ComponentType<CustomGameScreenProps>,
  chaseBall: ChaseBallScreen as React.ComponentType<CustomGameScreenProps>,
  clickLetter: ClickLetterScreen as React.ComponentType<CustomGameScreenProps>,
}

// Registry: mini-game id → standalone screen component.
const MINI_GAME_SCREENS: Partial<Record<string, React.ComponentType<{ onBack: () => void }>>> = {
  letterMuncher: MiniGameScreen,
  dinoRun: DinoGameScreen,
  simonSays: SimonSaysBonusScreen,
  clickCircle: ClickCircleScreen,
  ticTacToe: TicTacToeScreen,
  frogger: FroggerScreen,
  spaceMath: SpaceMathScreen,
}

function App() {
  const [currentGame, setCurrentGame] = useState<GameConfig | null>(null)
  const [miniGameId, setMiniGameId] = useState<string | null>(null)
  const [miniGameOrigin, setMiniGameOrigin] = useState<'path' | 'bonus'>('path')
  const [showBonus, setShowBonus] = useState(false)
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

  const handleBack = useCallback(() => setCurrentGame(null), [])

  const handlePlayMiniGame = useCallback((id: string, origin: 'path' | 'bonus' = 'path') => {
    if (id === 'playGames') {
      setShowBonus(true)
      return
    }
    setMiniGameOrigin(origin)
    setMiniGameId(id)
  }, [])

  const handleMiniGameBack = useCallback(() => {
    setMiniGameId(null)
    if (miniGameOrigin === 'bonus') {
      setShowBonus(true)
    }
  }, [miniGameOrigin])

  // Route: regular game
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

  // Route: mini-game
  if (miniGameId !== null) {
    const MiniScreen = MINI_GAME_SCREENS[miniGameId]
    if (MiniScreen) {
      return <MiniScreen onBack={handleMiniGameBack} />
    }
  }

  // Route: Play Games hub
  if (showBonus) {
    return (
      <BonusScreen
        onBack={() => setShowBonus(false)}
        onPlay={(id) => handlePlayMiniGame(id, 'bonus')}
      />
    )
  }

  // Play Games hub unlocked when every Challenge game has ≥1 star
  const challengeGames = getGamesForSection('challenge')
  const bonusUnlocked =
    challengeGames.length > 0 && challengeGames.every((g) => getStars(g.id) >= 1)

  return (
    <HomeScreen
      isRandom={isRandom}
      onToggleRandom={() => setIsRandom(!isRandom)}
      onSelectGame={handleSelectGame}
      onPlayMiniGame={(id) => handlePlayMiniGame(id, 'path')}
      onShowBonus={() => setShowBonus(true)}
      bonusUnlocked={bonusUnlocked}
      onReset={handleReset}
      stats={stats}
      getStars={getStars}
      getTotalStars={getTotalStars}
      isSectionUnlocked={isSectionUnlocked}
    />
  )
}

export default App

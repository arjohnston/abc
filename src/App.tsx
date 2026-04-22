import { useCallback, useState } from 'react'

import { useProgress } from './common/hooks/useProgress'
import { useStats } from './common/hooks/useStats'
import type { CustomGameScreenProps, GameConfig, SimonSaysGameConfig } from './common/types/game'
import { getGamesForSection } from './games/config'
import { ChaseBallScreen } from './pages/arcade/chase-ball/ChaseBallScreen'
import { ClickCircleScreen } from './pages/arcade/click-circle/ClickCircleScreen'
import { ClickLetterScreen } from './pages/arcade/click-letter/ClickLetterScreen'
import { DinoGameScreen } from './pages/arcade/dino/DinoGameScreen'
import { FollowArrowScreen } from './pages/arcade/follow-arrow/FollowArrowScreen'
import { FroggerScreen } from './pages/arcade/frogger/FroggerScreen'
import { MiniGameScreen } from './pages/arcade/mini-game/MiniGameScreen'
import { MouseDirectionScreen } from './pages/arcade/mouse-direction/MouseDirectionScreen'
import { SimonSaysScreen } from './pages/arcade/simon-says/SimonSaysScreen'
import { SpaceMathScreen } from './pages/arcade/space-math/SpaceMathScreen'
import { TicTacToeScreen } from './pages/arcade/tic-tac-toe/TicTacToeScreen'
import { BonusScreen } from './pages/bonus/BonusScreen'
import { GameScreen } from './pages/game/GameScreen'
import { HomeScreen } from './pages/home/HomeScreen'

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

import { useCallback, useState } from 'react'

import { useProgress } from './hooks/useProgress'
import { useStats } from './hooks/useStats'
import { GameScreen } from './pages/GameScreen'
import { HomeScreen } from './pages/HomeScreen'
import { MiniGameScreen } from './pages/MiniGameScreen'
import type { GameConfig } from './types/game'

function App() {
  const [currentGame, setCurrentGame] = useState<GameConfig | null>(null)
  const [showMiniGame, setShowMiniGame] = useState(false)
  const [isRandom, setIsRandom] = useState(true)
  const { stats, recordPlay } = useStats()
  const { getStars, getTotalStars, isSectionUnlocked, recordResult } = useProgress()

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

  if (showMiniGame) {
    return <MiniGameScreen onBack={() => setShowMiniGame(false)} />
  }

  return (
    <HomeScreen
      isRandom={isRandom}
      onToggleRandom={() => setIsRandom(!isRandom)}
      onSelectGame={handleSelectGame}
      onPlayMiniGame={() => setShowMiniGame(true)}
      stats={stats}
      getStars={getStars}
      getTotalStars={getTotalStars}
      isSectionUnlocked={isSectionUnlocked}
    />
  )
}

export default App

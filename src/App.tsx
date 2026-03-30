import { useCallback, useState } from 'react'

import { GAMES } from './games/config'
import { useStats } from './hooks/useStats'
import { GameScreen } from './pages/GameScreen'
import { HomeScreen } from './pages/HomeScreen'

function App() {
  const [currentGame, setCurrentGame] = useState<string | null>(null)
  const [isRandom, setIsRandom] = useState(false)
  const { stats, recordPlay, recordCompletion } = useStats()

  const game = currentGame ? GAMES[currentGame] : undefined

  const handleSelectGame = useCallback(
    (key: string) => {
      recordPlay()
      setCurrentGame(key)
    },
    [recordPlay],
  )

  if (currentGame && game) {
    return (
      <GameScreen
        key={`${currentGame}-${isRandom}`}
        game={game}
        gameKey={currentGame}
        isRandom={isRandom}
        onBack={() => setCurrentGame(null)}
        onComplete={recordCompletion}
      />
    )
  }

  return (
    <HomeScreen
      games={GAMES}
      isRandom={isRandom}
      onToggleRandom={() => setIsRandom(!isRandom)}
      onSelectGame={handleSelectGame}
      stats={stats}
    />
  )
}

export default App

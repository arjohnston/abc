import './TicTacToeScreen.css'

import { Button } from '@common/components/Button/Button'
import { Confetti } from '@common/components/Confetti/Confetti'
import { GameShell } from '@common/components/GameShell/GameShell'
import { CoreText } from '@core'
import { useSoundEffects } from '@hooks/useSoundEffects'
import { useCallback, useState } from 'react'

type Cell = 'X' | 'O' | null
type Board = Cell[]

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
]

function checkWinner(board: Board): { winner: 'X' | 'O'; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line as [number, number, number]
    const cell = board[a]
    if (cell && cell === board[b] && cell === board[c]) {
      return { winner: cell, line }
    }
  }
  return null
}

function isDraw(board: Board): boolean {
  return board.every((c) => c !== null) && !checkWinner(board)
}

// Minimax — returns best score for 'O'
function minimax(board: Board, isMaximizing: boolean, depth: number): number {
  const win = checkWinner(board)
  if (win) {
    return win.winner === 'O' ? 10 - depth : depth - 10
  }
  if (isDraw(board)) {
    return 0
  }

  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const next = [...board] as Board
        next[i] = 'O'
        best = Math.max(best, minimax(next, false, depth + 1))
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const next = [...board] as Board
        next[i] = 'X'
        best = Math.min(best, minimax(next, true, depth + 1))
      }
    }
    return best
  }
}

// Medium: 75% of the time play optimal, 25% random
function computerMove(board: Board): number {
  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i !== -1)
  if (empty.length === 0) {
    return -1
  }

  if (Math.random() < 0.25) {
    return empty[Math.floor(Math.random() * empty.length)] ?? empty[0] ?? -1
  }

  let bestScore = -Infinity
  let bestMove = empty[0] ?? -1
  for (const i of empty) {
    const next = [...board] as Board
    next[i] = 'O'
    const score = minimax(next, false, 0)
    if (score > bestScore) {
      bestScore = score
      bestMove = i
    }
  }
  return bestMove
}

interface Props {
  onBack: () => void
}

export function TicTacToeScreen({ onBack }: Props) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [playerTurn, setPlayerTurn] = useState(true) // true = X (player), false = O (computer)
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null)
  const [winLine, setWinLine] = useState<number[] | null>(null)
  const [thinking, setThinking] = useState(false)

  const { playCorrect, playWrong, playComplete } = useSoundEffects()

  const handleResult = useCallback(
    (board: Board) => {
      const win = checkWinner(board)
      if (win) {
        setWinLine(win.line)
        if (win.winner === 'X') {
          setResult('win')
          playComplete()
        } else {
          setResult('lose')
          playWrong()
        }
        return true
      }
      if (isDraw(board)) {
        setResult('draw')
        playCorrect()
        return true
      }
      return false
    },
    [playComplete, playWrong, playCorrect],
  )

  const handleClick = useCallback(
    (i: number) => {
      if (!playerTurn || board[i] || result || thinking) {
        return
      }

      const next = [...board] as Board
      next[i] = 'X'
      setBoard(next)
      playCorrect()

      if (handleResult(next)) {
        return
      }

      setPlayerTurn(false)
      setThinking(true)

      setTimeout(() => {
        const move = computerMove(next)
        if (move === -1) {
          return
        }
        const next2 = [...next] as Board
        next2[move] = 'O'
        setBoard(next2)
        setThinking(false)
        if (!handleResult(next2)) {
          setPlayerTurn(true)
        }
      }, 500)
    },
    [board, playerTurn, result, thinking, playCorrect, handleResult],
  )

  const handleRestart = useCallback(() => {
    setBoard(Array(9).fill(null))
    setPlayerTurn(true)
    setResult(null)
    setWinLine(null)
    setThinking(false)
  }, [])

  const status =
    result === 'win'
      ? '🎉 You Win!'
      : result === 'lose'
        ? '😮 Computer Wins'
        : result === 'draw'
          ? "🤝 It's a Draw!"
          : thinking
            ? '🤔 Thinking...'
            : playerTurn
              ? 'Your turn! (X)'
              : ''

  return (
    <GameShell onBack={onBack} percent={0} score={0} center paddingBottom={24} className="ttt">
      {result === 'win' && <Confetti />}

      <CoreText size="h3" color="muted" align="center" className="ttt-status">
        {status}
      </CoreText>

      <div className="ttt-board">
        {board.map((cell, i) => {
          const inWinLine = winLine?.includes(i) ?? false
          return (
            <button
              key={i}
              className={`ttt-cell ${cell ? `ttt-cell--${cell.toLowerCase()}` : ''} ${inWinLine ? 'ttt-cell--win' : ''}`}
              onClick={() => handleClick(i)}
              disabled={!!cell || !!result || !playerTurn}
            >
              {cell}
            </button>
          )
        })}
      </div>

      {result && (
        <div className="ttt-actions">
          <Button variant="primary" onClick={handleRestart}>
            Play Again
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Home
          </Button>
        </div>
      )}

      <CoreText size="sm" color="muted" style={{ marginTop: '20px' }}>
        You = <strong>X</strong> &nbsp; Computer = <strong>O</strong>
      </CoreText>
    </GameShell>
  )
}

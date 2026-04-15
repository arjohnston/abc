import './MiniGameNode.css'

interface MiniGameNodeProps {
  emoji: string
  title: string
  onClick: () => void
}

export function MiniGameNode({ emoji, title, onClick }: MiniGameNodeProps) {
  return (
    <button className="mini-game-node" onClick={onClick}>
      <div className="mini-game-node__circle">
        <span className="mini-game-node__emoji">{emoji}</span>
      </div>
      <div className="mini-game-node__label">
        <span className="mini-game-node__title">{title}</span>
        <span className="mini-game-node__sub">Bonus!</span>
      </div>
    </button>
  )
}

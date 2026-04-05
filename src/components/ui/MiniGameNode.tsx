import './MiniGameNode.css'

interface MiniGameNodeProps {
  onClick: () => void
}

export function MiniGameNode({ onClick }: MiniGameNodeProps) {
  return (
    <button className="mini-game-node" onClick={onClick}>
      <div className="mini-game-node__circle">
        <span className="mini-game-node__emoji">🐛</span>
      </div>
      <div className="mini-game-node__label">
        <span className="mini-game-node__title">Letter Muncher</span>
        <span className="mini-game-node__sub">Bonus!</span>
      </div>
    </button>
  )
}

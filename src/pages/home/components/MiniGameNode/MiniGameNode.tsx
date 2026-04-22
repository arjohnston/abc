import './MiniGameNode.css'

interface MiniGameNodeProps {
  emoji: string
  title: string
  onClick: () => void
  locked?: boolean
  lockHint?: string
}

export function MiniGameNode({
  emoji,
  title,
  onClick,
  locked = false,
  lockHint,
}: MiniGameNodeProps) {
  return (
    <button
      className={`mini-game-node ${locked ? 'mini-game-node--locked' : ''}`}
      onClick={locked ? undefined : onClick}
      data-tooltip={locked && lockHint ? lockHint : undefined}
    >
      <div className="mini-game-node__circle">
        <span className="mini-game-node__emoji">{locked ? '🔒' : emoji}</span>
      </div>
      <div className="mini-game-node__label">
        <span className="mini-game-node__title">{title}</span>
        <span className="mini-game-node__sub">{locked ? 'Locked' : 'Bonus!'}</span>
      </div>
    </button>
  )
}

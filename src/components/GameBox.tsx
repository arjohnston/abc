import './GameBox.css'

interface GameBoxProps {
  className?: string
  children?: React.ReactNode
}

export function GameBox({ className, children }: GameBoxProps) {
  return (
    <div className={['game-box', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

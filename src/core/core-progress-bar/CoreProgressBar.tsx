import './CoreProgressBar.css'

export interface CoreProgressBarProps {
  percent: number
  className?: string
}

export function CoreProgressBar({ percent, className }: CoreProgressBarProps) {
  return (
    <div className={['core-progress-bar', className].filter(Boolean).join(' ')}>
      <div className="core-progress-bar__fill" style={{ width: `${percent}%` }} />
    </div>
  )
}

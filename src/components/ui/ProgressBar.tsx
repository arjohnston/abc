import './ProgressBar.css'

interface ProgressBarProps {
  percent: number
}

export function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

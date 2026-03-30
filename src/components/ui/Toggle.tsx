import './Toggle.css'

interface ToggleProps {
  active: boolean
  label: string
  onToggle: () => void
}

export function Toggle({ active, label, onToggle }: ToggleProps) {
  return (
    <button className={`toggle-btn ${active ? 'active' : ''}`} onClick={onToggle}>
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-label">{label}</span>
    </button>
  )
}

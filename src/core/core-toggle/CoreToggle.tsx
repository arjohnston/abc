import './CoreToggle.css'

export interface CoreToggleProps {
  active: boolean
  label: string
  onToggle: () => void
}

export function CoreToggle({ active, label, onToggle }: CoreToggleProps) {
  return (
    <button
      className={`core-toggle ${active ? 'core-toggle--active' : ''}`}
      onClick={onToggle}
      aria-pressed={active}
    >
      <span className="core-toggle__track">
        <span className="core-toggle__thumb" />
      </span>
      <span className="core-toggle__label">{label}</span>
    </button>
  )
}

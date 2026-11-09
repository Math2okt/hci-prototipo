import { Icon } from './Icon'

interface ChipProps {
  label: string
  active: boolean
  onToggle: () => void
}

export function Chip({ label, active, onToggle }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip${active ? ' chip--active' : ''}`}
      aria-pressed={active}
      onClick={onToggle}
    >
      {label}
      {active ? <Icon name="close" size={12} /> : null}
    </button>
  )
}

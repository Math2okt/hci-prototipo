import { Icon } from './Icon'

interface StarsProps {
  value: number
  size?: number
  onChange?: (value: number) => void
}

export function Stars({ value, size = 16, onChange }: StarsProps) {
  return (
    <div
      className={`stars${onChange ? ' stars--interactive' : ''}`}
      role={onChange ? 'group' : 'img'}
      aria-label={
        onChange
          ? 'Calificación de 1 a 5 estrellas'
          : `${value} de 5 estrellas`
      }
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value

        if (onChange) {
          return (
            <button
              key={star}
              type="button"
              className="stars__button"
              aria-label={`${star} de 5 estrellas`}
              aria-pressed={filled}
              onClick={() => onChange(star)}
            >
              <Icon name="star" size={size} filled={filled} />
            </button>
          )
        }

        return (
          <span key={star} className="stars__item">
            <Icon name="star" size={size} filled={filled} />
          </span>
        )
      })}
    </div>
  )
}

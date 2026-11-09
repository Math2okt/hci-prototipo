import { ImagePlaceholder } from './ImagePlaceholder'

interface ResultCardProps {
  title: string
  meta: string
  onSelect: () => void
}

export function ResultCard({ title, meta, onSelect }: ResultCardProps) {
  return (
    <button type="button" className="result-card" onClick={onSelect}>
      <ImagePlaceholder className="result-card__thumb" />
      <span className="result-card__content">
        <span className="result-card__title">{title}</span>
        <span className="result-card__meta">{meta}</span>
      </span>
    </button>
  )
}

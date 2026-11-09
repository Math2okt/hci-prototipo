interface ImagePlaceholderProps {
  className?: string
}

export function ImagePlaceholder({
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`image-placeholder ${className}`.trim()}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100" y2="100" />
        <line x1="100" y1="0" x2="0" y2="100" />
      </svg>
    </div>
  )
}

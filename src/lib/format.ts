export function formatPrice(value: number): string {
  return `Gs. ${Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

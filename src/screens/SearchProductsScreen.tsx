import { useRef, type FormEvent } from 'react'
import { Chip } from '../components/Chip'
import { Icon } from '../components/Icon'
import { ResultCard } from '../components/ResultCard'
import { places } from '../data/mockData'
import { formatPrice } from '../lib/format'
import { navigate } from '../lib/router'
import { findProducts } from '../lib/search'
import type { ProductFilter } from '../types'

const filters: { id: ProductFilter; label: string }[] = [
  { id: 'cercano', label: 'Más cercano' },
  { id: 'precio', label: 'Mejor precio' },
  { id: 'abierto', label: 'Abierto ahora' },
]

interface SearchProductsScreenProps {
  query: string
  activeFilters: ProductFilter[]
  onQueryChange: (query: string) => void
  onToggleFilter: (filter: ProductFilter) => void
}

export function SearchProductsScreen({
  query,
  activeFilters,
  onQueryChange,
  onToggleFilter,
}: SearchProductsScreenProps) {
  const resultsRef = useRef<HTMLHeadingElement>(null)
  const results = findProducts(places, query, activeFilters)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resultsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="screen">
      <div className="screen__scroll">
        <form className="search-form" onSubmit={handleSubmit}>
          <h1 className="search-title">Quiero:</h1>
          <div className="search-field">
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="llanta Michelin"
              aria-label="Buscar un producto o servicio"
            />
            <button type="submit" aria-label="Buscar productos">
              <Icon name="search" size={18} />
            </button>
          </div>
        </form>

        <div className="chips chips--products" aria-label="Filtros para productos">
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              active={activeFilters.includes(filter.id)}
              onToggle={() => onToggleFilter(filter.id)}
            />
          ))}
        </div>
        <p className="helper-text">Podés elegir varios</p>

        <h2 className="results-title" ref={resultsRef}>
          Resultados
        </h2>
        <div className="results-list">
          {results.map((result) => (
            <ResultCard
              key={`${result.place.id}-${result.product.id}`}
              title={result.place.name}
              meta={`Precio estimado: ${formatPrice(result.product.price)}`}
              onSelect={() =>
                navigate({
                  screen: 'product',
                  placeId: result.place.id,
                  productId: result.product.id,
                  tab: 'info',
                })
              }
            />
          ))}
        </div>

        {results.length === 0 ? (
          <p className="empty-state">
            No encontramos lugares que ofrezcan ese producto. Probá con
            otras palabras o quitá algún filtro.
          </p>
        ) : null}
      </div>
    </div>
  )
}

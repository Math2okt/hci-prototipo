import { useRef, type FormEvent } from 'react'
import { Chip } from '../components/Chip'
import { Icon } from '../components/Icon'
import { ResultCard } from '../components/ResultCard'
import { places } from '../data/mockData'
import { navigate } from '../lib/router'
import { findPlaces } from '../lib/search'
import type { PlaceFilter } from '../types'

const filters: { id: PlaceFilter; label: string }[] = [
  { id: 'cercano', label: 'Más cercano' },
  { id: 'precio', label: 'El mejor precio' },
  { id: 'descuentos', label: 'Descuentos' },
  { id: 'reintegros', label: 'Reintegros' },
]

interface SearchPlacesScreenProps {
  query: string
  activeFilters: PlaceFilter[]
  onQueryChange: (query: string) => void
  onToggleFilter: (filter: PlaceFilter) => void
}

export function SearchPlacesScreen({
  query,
  activeFilters,
  onQueryChange,
  onToggleFilter,
}: SearchPlacesScreenProps) {
  const resultsRef = useRef<HTMLHeadingElement>(null)
  const results = findPlaces(places, query, activeFilters)

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
          <h1 className="search-title">Quiero buscar un lugar para:</h1>
          <div className="search-field">
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="comprar frutas"
              aria-label="Buscar un lugar para"
            />
            <button type="submit" aria-label="Buscar lugares">
              <Icon name="search" size={18} />
            </button>
          </div>
        </form>

        <p className="filter-label">Con:</p>
        <div className="chips" aria-label="Filtros para lugares">
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              active={activeFilters.includes(filter.id)}
              onToggle={() => onToggleFilter(filter.id)}
            />
          ))}
        </div>
        <p className="helper-text">Podés elegir varios filtros</p>

        <h2 className="results-title" ref={resultsRef}>
          Resultados
        </h2>
        <div className="results-list">
          {results.map((place) => (
            <ResultCard
              key={place.id}
              title={place.name}
              meta={place.summary}
              onSelect={() =>
                navigate({
                  screen: 'place',
                  placeId: place.id,
                  tab: 'info',
                })
              }
            />
          ))}
        </div>

        {results.length === 0 ? (
          <p className="empty-state">
            No encontramos lugares para esa búsqueda. Probá con otras
            palabras o quitá algún filtro.
          </p>
        ) : null}
      </div>
    </div>
  )
}

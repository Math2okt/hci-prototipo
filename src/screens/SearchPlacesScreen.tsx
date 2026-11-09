import { Chip } from '../components/Chip'
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
  const results = findPlaces(places, query, activeFilters)

  return (
    <div className="screen">
      <div className="screen__scroll">
        <div className="search-form">
          <h1 className="search-title">Quiero buscar un lugar para:</h1>
          <div className="search-field">
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="comprar frutas"
              aria-label="Buscar un lugar para"
            />
          </div>
        </div>

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

        <h2 className="results-title">Resultados</h2>
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

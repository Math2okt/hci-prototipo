import { useState, type ReactNode } from 'react'
import './App.css'
import { BottomNav, type NavSection } from './components/BottomNav'
import { places } from './data/mockData'
import { navigate, useHashRoute } from './lib/router'
import { AddSiteScreen } from './screens/AddSiteScreen'
import { PlaceDetailScreen } from './screens/PlaceDetailScreen'
import { SearchPlacesScreen } from './screens/SearchPlacesScreen'
import { SearchProductsScreen } from './screens/SearchProductsScreen'
import type {
  PlaceFilter,
  PlaceTab,
  ProductFilter,
  ProductTab,
  Review,
} from './types'

const tabLabels: Record<PlaceTab, string> = {
  info: 'Info',
  productos: 'Productos',
  ofertas: 'Ofertas',
  resenas: 'Reseñas',
}

const initialPlaceFilters: PlaceFilter[] = ['cercano', 'precio']
const initialProductFilters: ProductFilter[] = ['cercano', 'precio']

function NotFoundScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="screen">
      <div className="screen__scroll not-found">
        <h1>No encontramos esta página</h1>
        <p>
          El enlace puede estar incompleto o el sitio ya no existe en este
          prototipo.
        </p>
        <button type="button" className="outline-button" onClick={onBack}>
          Volver a buscar lugares
        </button>
      </div>
    </div>
  )
}

function App() {
  const route = useHashRoute()
  const [placeQuery, setPlaceQuery] = useState('comprar frutas')
  const [placeFilters, setPlaceFilters] =
    useState<PlaceFilter[]>(initialPlaceFilters)
  const [productQuery, setProductQuery] = useState('llanta Michelin')
  const [productFilters, setProductFilters] =
    useState<ProductFilter[]>(initialProductFilters)
  const [addedReviews, setAddedReviews] = useState<Record<string, Review[]>>(
    {},
  )

  const activePlace =
    route.screen === 'place' || route.screen === 'product'
      ? places.find((place) => place.id === route.placeId)
      : undefined

  const activeProduct =
    route.screen === 'product' && activePlace
      ? (activePlace.products.find(
          (product) => product.id === route.productId,
        ) ?? activePlace.products[0])
      : undefined

  const togglePlaceFilter = (filter: PlaceFilter) => {
    setPlaceFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter],
    )
  }

  const toggleProductFilter = (filter: ProductFilter) => {
    setProductFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter],
    )
  }

  const handleAddReview = (placeId: string, review: Review) => {
    setAddedReviews((current) => ({
      ...current,
      [placeId]: [review, ...(current[placeId] ?? [])],
    }))
  }

  let label = 'Buscar lugar'
  let section: NavSection = 'places'
  let screen: ReactNode

  if (route.screen === 'search-places') {
    screen = (
      <SearchPlacesScreen
        query={placeQuery}
        activeFilters={placeFilters}
        onQueryChange={setPlaceQuery}
        onToggleFilter={togglePlaceFilter}
      />
    )
  } else if (route.screen === 'place' && activePlace) {
    label = `${activePlace.name} · ${tabLabels[route.tab]}`
    screen = (
      <PlaceDetailScreen
        place={activePlace}
        activeTab={route.tab}
        addedReviews={addedReviews[activePlace.id] ?? []}
        onTabChange={(tab) =>
          navigate(
            { screen: 'place', placeId: activePlace.id, tab },
            true,
          )
        }
        onBack={() => navigate({ screen: 'search-places' }, true)}
        onAddReview={(review) => handleAddReview(activePlace.id, review)}
      />
    )
  } else if (route.screen === 'search-products') {
    label = 'Buscar producto o servicio'
    section = 'products'
    screen = (
      <SearchProductsScreen
        query={productQuery}
        activeFilters={productFilters}
        onQueryChange={setProductQuery}
        onToggleFilter={toggleProductFilter}
      />
    )
  } else if (route.screen === 'product' && activePlace && activeProduct) {
    label = `Detalle ${activePlace.name}`
    section = 'products'
    screen = (
      <PlaceDetailScreen
        place={activePlace}
        product={activeProduct}
        activeTab={route.tab}
        addedReviews={addedReviews[activePlace.id] ?? []}
        onTabChange={(tab) => {
          const productTab: ProductTab =
            tab === 'productos' || tab === 'resenas' ? tab : 'info'
          navigate(
            {
              screen: 'product',
              placeId: activePlace.id,
              productId: activeProduct.id,
              tab: productTab,
            },
            true,
          )
        }}
        onBack={() => navigate({ screen: 'search-products' }, true)}
        onAddReview={(review) => handleAddReview(activePlace.id, review)}
      />
    )
  } else if (route.screen === 'add-site') {
    label = 'Añadir sitio'
    section = 'add'
    screen = <AddSiteScreen />
  } else {
    label = 'Pantalla no encontrada'
    screen = <NotFoundScreen onBack={() => navigate({ screen: 'search-places' })} />
  }

  return (
    <main className="canvas">
      <div className="frame">
        <div className="screen-label" aria-hidden="true">
          {label}
        </div>
        <div className="phone">
          <div className="phone__viewport">{screen}</div>
          <BottomNav active={section} />
        </div>
      </div>
    </main>
  )
}

export default App
